import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { logger } from "../../utils/logger";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainNtelController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public type = "";
    public errors: string[] = [];
    public amount = "";
    public code = "";
    public description = "";
    public phone = "";
    public request_id = "";
    public name = "";
    async validate() {
        if (!this.body.body.type) {
            this.errors.push("type is requiredd");
        } else {
            this.type = this.body.body.type;
        }
        if (this.errors.length >= 1) {
            return { messgae: "failled", status: "300", error: this.errors };
        }
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const { data } = await axios.post(config.shago.testUrl, { serviceCode: "NBV" }, { headers: { hashKey: config.shago.key } });
        const response = data as unknown as ntelValidate;
        if (response.status === "200") {
            return { message: response.message, status: response.status, product: response.product, type: response.type, phone: response.phone };
        }
        return { message: "failed", status: "300" };
    }
    async TopUp() {
        if (!this.body.body.code) {
            this.errors.push("code is required");
        } else {
            this.code = this.body.body.code;
        }
        if (!this.body.body.phone) {
            this.errors.push("phone is required");
        } else {
            this.phone = this.body.body.phone;
        }
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is required");
        } else {
            this.amount = this.body.body.amount;
        }
        if (!this.body.body.description) {
            this.errors.push("description is required");
        } else {
            this.description = this.body.body.description;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (this.errors.length >= 1) {
            return { status: "400", error: this.errors };
        }
        const checkNtel = await prisma.ntel_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkNtel) return { message: "Duplicate request ID", status: "301" };

        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const payload = JSON.stringify(this.body.body);
        logger.info(payload);
        const newNtelRequest = await prisma.ntel_requests.create({
            data: {
                request_id: this.request_id,
                user_id: this.user.id,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                trans_code: uuid().slice(0, 10),
                payload,
                amount: Number(this.amount),
                code: this.code,
                description: this.description,
                name: this.type,
                customerNumber: this.phone,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, newNtelRequest.trans_code, "Ntel Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newNtelRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async recharge() {
        if (!this.body.body.phone) {
            this.errors.push("phone is required");
        } else {
            this.phone = this.body.body.phone;
        }
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
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
        if (this.errors.length >= 1) {
            return { status: "400", error: this.errors };
        }

        const checkNtel = await prisma.ntel_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkNtel) return { message: "Duplicate request ID", status: "301" };

        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const payload = JSON.stringify(this.body.body);
        logger.info(payload);
        const newNtelRequest = await prisma.ntel_requests.create({
            data: {
                request_id: this.request_id,
                user_id: this.user.id,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                trans_code: uuid().slice(0, 10),
                payload,
                amount: Number(this.amount),
                code: "recharge",
                description: "recharge of ntel number",
                name: this.type,
                customerNumber: this.phone,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, newNtelRequest.trans_code, "Ntel Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newNtelRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, reference: string) {
        const checkNtel = await prisma.ntel_requests.findUnique({ where: { trans_code } });
        if (!checkNtel) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkNtel.request_id,
                amount: Number(this.amount),
                source: checkNtel.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "Ntel Recharge Purchase",
                destination: checkNtel.customerNumber,
                user_id: checkNtel.user_id,
                product_category_id: checkNtel.category_id,
                payment_status: "ZERO",
            },
        });
        if (this.body.body.serviceCode === "NTOP") {
            const { data } = await axios.post(config.shago.testUrl, { serviceCode: "NVT", amount: checkNtel.amount, phone: checkNtel.customerNumber, request_id: checkNtel.trans_code }, { headers: { hashKey: config.shago.key } });
            const response = data as unknown as ntelTopUpResponse;
            if (response.status === "200") {
                const commission = new CommissionController(trans_code, "NTEL");
                await commission.disubrse();
                try {
                    Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.ntel_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
                } catch (error) {
                    logger.error(error);
                    return { message: "failed", status: "300" };
                }

                return { message: response.message, status: response.status, type: response.type, date: response.date, transId: response.transId, amount: response.amount, phone: response.phone };
            }
            try {
                Promise.all([await prisma.ntel_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(this.amount), "NTEL", trans_code, "REVERSAL_SMILE_RECHARGE");
            const credit = await wallet.credit();
            if (credit.message === "failed")
                return {
                    message: "failed",
                    status: "300",
                };

            return {
                message: "failed",
                status: "300",
            };
        }
        const { data } = await axios.post(
            config.shago.testUrl,
            { serviceCode: "NBP", amount: checkNtel.amount, phone: checkNtel.customerNumber, request_id: checkNtel.trans_code, code: checkNtel.code, description: checkNtel.description },
            { headers: { hashKey: config.shago.key } },
        );
        const response = data as unknown as ntelBundleResponse;
        if (response.status === "200") {
            const commission = new CommissionController(trans_code, "NTEL");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.ntel_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }

            return { message: response.message, status: response.status, type: response.type, date: response.date, transId: response.transId, amount: response.amount, phone: response.phone, package: response.package };
        }
        try {
            Promise.all([await prisma.ntel_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
        } catch (error) {
            logger.error(error);
            return { message: error, status: "300" };
        }
        const wallet = new WalletController(this.user.id, Number(this.amount), "NTEL", trans_code, "REVERSAL_SPECTRANET_RECHARGE");
        const credit = await wallet.credit();
        if (credit.message === "failed")
            return {
                message: "failed",
                status: "300",
            };

        return {
            message: "failed",
            status: "300",
        };
    }
}
