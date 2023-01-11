import { users } from "@prisma/client";
import { Request } from "express";
import { validateDisco } from "./validate";
import { PrismaClient } from "@prisma/client";
import { logger } from "../../utils/logger";
import { checkMobileNumber } from "../../common/checkNumber";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { PayDisco } from "./purchase";

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
    public prisma = new PrismaClient();
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
        const productStatus = await this.prisma.product_categories.findFirst({ where: { name: this.name } });
        if (productStatus?.status === "1") {
            return { status: 400, message: "product is not available yet" };
        }
        const checkSwitcher = await this.prisma.switchers.findFirst({ where: { name: this.name } });
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

        const checkTrans = await this.prisma.transactions.findUnique({ where: { request_id: this.request_id } });
        if (checkTrans) return { message: "Duplicate request Id", status: "310" };

        const payload = JSON.stringify(this.body.body);
        logger.info(JSON.stringify(this.body.body));
        logger.info(JSON.stringify(this.user));
        this.body.body?.type === "POSTPAID" ? (this.suffix = "POSTPAID") : (this.suffix = "PREPAID");
        this.name = `${this.disco}_${this.suffix}`;
        const productStatus = await this.prisma.product_categories.findFirst({ where: { name: this.name } });
        if (productStatus?.status === "1") {
            return { status: 400, message: "product is not available yet" };
        }
        const checkSwitcher = await this.prisma.switchers.findFirst({ where: { name: this.name } });
        if (!checkSwitcher) {
            return { message: "failed", status: 400 };
        }

        const newDisco = await this.prisma.disco_requests.create({
            data: {
                request_id: this.request_id,
                phoneNumber: this.phone_number,
                user_id: BigInt(this.user.id),
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
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            return await this.giveValue(newDisco.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, data: string) {
        const checkDisco = await this.prisma.disco_requests.findUnique({ where: { request_id: trans_code } });
        if (!checkDisco) return { message: "failed", status: "400" };
        await this.prisma.transactions.create({
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
    }
}
