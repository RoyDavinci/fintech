import { users } from "@prisma/client";
import { Request } from "express";
import { validateDisco } from "./validate";
import { logger } from "../../utils/logger";
import { checkMobileNumber } from "../../common/checkNumber";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { PayDisco } from "./purchase";
import { CommissionController } from "../../helpers/CommissionController";
import { prisma } from "../../models/prisma";

export class MainDiscoController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }

    public errors: string[] = [];
    public disco: string = "";
    public type: string = "";
    public meterNo: string = "";
    public suffix: string = "";
    public name: string = "";
    public amount: string = "";
    public request_id: string = "";
    public phone_number: string = "";

    async validate() {
        if (!this.body.body?.disco) {
            this.errors.push("disco is required");
        } else {
            this.disco = this.body.body?.disco;
        }
        if (!this.body.body?.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body?.type;
        }
        if (!this.body.body?.meterNo) {
            this.errors.push("meter number is required");
        } else {
            this.meterNo = this.body.body?.meterNo;
        }
        if (this.errors.length >= 1) {
            return { status: "400", error: this.errors };
        }

        this.body.body?.type === "POSTPAID" ? (this.suffix = "POSTPAID") : (this.suffix = "PREPAID");
        logger.info(this.suffix, this.disco);
        this.name = `${this.disco}_${this.suffix}`;
        const productStatus = await prisma.product_categories.findFirst({ where: { name: this.name } });
        if (productStatus?.status === "1") {
            return { status: 400, message: "product is not available yet" };
        }
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: this.name } });
        if (!checkSwitcher) {
            return { message: "failed", status: 400 };
        }

        const validation = await validateDisco(this.disco, checkSwitcher.biller_id, this.meterNo, this.type);
        if (validation.status === "400") {
            return { phone: validation };
        }
        return { ...validation };
    }
    async purchase() {
        if (!this.body.body?.disco) {
            this.errors.push("disco is required");
        } else {
            this.disco = this.body.body?.disco;
        }
        if (!this.body.body?.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body?.type;
        }
        if (!this.body.body?.meterNo) {
            this.errors.push("meter number is required");
        } else {
            this.meterNo = this.body.body?.meterNo;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is required");
        } else {
            this.amount = this.body.body.amount;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (!this.body.body.phone_number) {
            this.errors.push("phone_number is required");
        } else {
            this.phone_number = this.body.body.phone_number;
        }
        if (this.errors.length >= 1) {
            return { status: "301", required_fields: this.errors, message: "failed" };
        }
        const checkPhone = checkMobileNumber(this.phone_number);
        if (!checkPhone.correct) {
            return { message: checkPhone.message, status: checkPhone.status };
        }

        const checkTrans = await prisma.transactions.findUnique({ where: { request_id: this.request_id } });
        if (checkTrans) return { message: "Duplicate request Id", status: "310" };

        const payload = JSON.stringify(this.body.body);
        this.body.body?.type === "POSTPAID" ? (this.suffix = "POSTPAID") : (this.suffix = "PREPAID");
        this.name = `${this.disco}_${this.suffix}`;
        const productStatus = await prisma.product_categories.findFirst({ where: { name: this.name } });
        if (productStatus?.status === "1") {
            return { status: 400, message: "product is not available yet" };
        }
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: this.name } });
        if (!checkSwitcher) {
            return { message: "failed", status: "300" };
        }

        const checkProduct = await prisma.disco_requests.findFirst({ where: { request_id: this.request_id } });
        if (checkProduct) {
            return { message: "duplicate request Id", status: "300" };
        }

        const newDisco = await prisma.disco_requests.create({
            data: {
                request_id: this.request_id,
                phoneNumber: this.phone_number,
                user_id: this.user.id,
                meterNo: this.meterNo,
                amount: Number(this.amount),
                type: this.type,
                trans_code: uuid(),
                payload: payload,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                name: this.name,
                disco_type: this.disco,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), "DISCO", newDisco.trans_code, "Electricity Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newDisco.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, data: string): Promise<Partial<electrictyPaymentResponse & failedResponse>> {
        const checkDisco = await prisma.disco_requests.findUnique({ where: { trans_code: trans_code } });
        if (!checkDisco) return { message: "failed", status: "400" };
        await prisma.transactions.create({
            data: {
                reference: checkDisco.request_id,
                amount: Number(this.amount),
                source: checkDisco.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: data,
                description: "Electricity Purchase",
                destination: checkDisco.meterNo,
                user_id: checkDisco.user_id,
                product_category_id: checkDisco.category_id,
                payment_status: "ZERO",
            },
        });
        const discoPayment = new PayDisco(checkDisco.id);
        const checkPayment = await discoPayment.buy();
        if (checkPayment?.status === "300") {
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } }), await prisma.disco_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: checkPayment.message, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(checkDisco.amount), "DISCO", trans_code, "REVERSAL_DISCO");
            await wallet.credit();
            return {
                message: checkPayment.message,
                status: checkPayment.status,
            };
        }
        if (checkPayment?.status === "400") {
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.disco_requests.update({ where: { trans_code: trans_code }, data: { status: "ZERO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(checkDisco.amount), "DISCO", trans_code, "REVERSAL_DISCO");
            await wallet.credit();
            return {
                message: "failed",
                status: checkPayment.status,
            };
        }
        try {
            Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.disco_requests.update({ where: { trans_code: trans_code }, data: { status: "ONE" } })]);
        } catch (error) {
            logger.error(error);
            return { message: "failed", status: "300" };
        }
        const commission = new CommissionController(trans_code, "DISCO");
        await commission.disubrse();
        return {
            token: checkPayment?.token,
            date: checkPayment?.date,
            status: "200",
            message: checkPayment?.message,
            amount: checkPayment?.amount,
            amountCharged: checkPayment?.amountCharged,
            TransRef: checkPayment?.TransRef,
            disco: checkPayment?.disco,
            customerName: checkPayment?.customerName,
            unit: checkPayment?.unit,
        };
    }
}
