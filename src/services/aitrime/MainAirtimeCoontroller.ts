import { users } from "@prisma/client";
import { Request } from "express";
import { checkMobileNumber } from "../../common/checkNumber";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainAirtimeController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public airtimeProductId = [
        {
            product_id: "MFIN-5-OR",
            product: "MTN",
        },
        {
            product_id: "MFIN-1-OR",
            product: "Airtel",
        },
        {
            product_id: "MFIN-6-OR",
            product: "Glo",
        },
        {
            product_id: "MFIN-2-OR",
            product: "9mobile",
        },
    ];
    public number = "";
    public request_id = "";
    public product_id = "";
    public amount = 0;
    public errors: string[] = [];
    public name = "";
    public network = "";
    async purchase() {
        if (!this.body.body.product_id) {
            this.errors.push("product_id is required");
        } else {
            this.product_id = this.body.body.product_id;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (!this.body.body.msisdn) {
            this.errors.push("phone number(msisdn) is required");
        } else {
            this.number = this.body.body.msisdn;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is required");
        } else {
            this.amount = this.body.body.amount;
        }
        if (this.errors.length >= 1) {
            return { message: this.errors, status: "500" };
        }

        const checkData = await prisma.airtime_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkData) return { message: "Duplicate request Id", status: "310" };

        const getProductId = this.airtimeProductId.find((item) => item.product_id === this.product_id);

        if (!getProductId) return { message: "invalid product id", status: "400" };
        this.network = getProductId.product;
        const productStatus = await prisma.product_categories.findFirst({ where: { name: `${getProductId.product} Airtime` } });
        if (!productStatus || productStatus.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }
        this.number.length > 11 ? (this.number.includes("+") ? this.number : (this.number = `+${this.number}`)) : this.number;
        logger.info(this.number);
        const checkPhone = checkMobileNumber(this.number.toString());
        if (!checkPhone.correct) {
            return { message: checkPhone.message, status: checkPhone.status };
        }

        const getBiller = await prisma.billers.findFirst({ where: { name: getProductId.product === "9mobile" ? "Etisalat" : getProductId.product.toLowerCase() } });
        if (!getBiller) return { message: "failed", status: "400" };

        const payload = JSON.stringify(this.body.body);
        logger.info(this.name);
        const newAirtimeRequest = await prisma.airtime_requests.create({
            data: { biller_id: getBiller.id, category_id: productStatus.id, amount: Number(this.amount), network: getProductId.product, trans_code: uuid(), request_id: this.request_id, user_id: this.user.id, phone_number: this.number, payload },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), "DATA", newAirtimeRequest.trans_code, "Airtime Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newAirtimeRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: productStatus.price };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkData = await prisma.airtime_requests.findUnique({ where: { trans_code: trans_code } });
        if (!checkData) return { message: "failed", status: "400" };
        try {
            await prisma.transactions.create({
                data: {
                    reference: checkData.request_id,
                    amount: Number(checkData.amount),
                    source: checkData.biller_id.toString(),
                    status: "ZERO",
                    channel: "B2B",
                    request_id: trans_code,
                    payment_method: reference,
                    description: "Airtime Purchase",
                    destination: checkData.phone_number,
                    user_id: checkData.user_id,
                    product_category_id: checkData.category_id,
                    payment_status: "ZERO",
                },
            });
            const commission = new CommissionController(trans_code, "AIRTIME");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.airtime_requests.update({ where: { trans_code: trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: "SUCCESSFUL", status: "200", amount: this.amount, amountCharged: `${this.amount}`, network: `${this.network} Airtime`, msisdn: this.number, TransRef: trans_code, ext_ref: "R220714.1614.220020" };
        } catch (error) {
            try {
                Promise.all([await prisma.airtime_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, this.amount, "Airtime", trans_code, "REVERSAL_AIRTIME");
            const credit = await wallet.credit();
            if (credit.message === "failed")
                return {
                    message: "failed",
                    status: "300",
                };

            logger.error(error);
            return {
                message: "failed",
                status: "300",
            };
        }
    }
}
