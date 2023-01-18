import { users } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../models/prisma";
import crypto from "crypto";
import axios from "axios";
import config from "../../config";
import { logger } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainShowMaxController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public type = "";
    public errors: string[] = [];
    public subscriptionType = "";
    public package = "";
    public amount = "";
    public request_id = "";
    public subscriptionPeriod = "";
    public phone = "";
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

        const { data } = await axios.post(config.shago.testUrl, { serviceCode: "SHL" }, { headers: { hashKey: config.shago.key } });
        const response = data as unknown as showMaxValidate;
        if (response.status === "200") {
            return { message: response.message, status: response.status, product: response.product };
        }
        return { message: "failed", status: "300" };
    }
    async purchase() {
        if (!this.body.body.subscriptionType) {
            this.errors.push("subscriptionType is requiredd");
        } else {
            this.subscriptionType = this.body.body.subscriptionType;
        }
        if (!this.body.body.package) {
            this.errors.push("package is requiredd");
        } else {
            this.package = this.body.body.package;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is requiredd");
        } else {
            this.amount = this.body.body.amount;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is requiredd");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (!this.body.body.subscriptionPeriod) {
            this.errors.push("subscriptionPeriod is requiredd");
        } else {
            this.subscriptionPeriod = this.body.body.subscriptionPeriod;
        }
        if (!this.body.body.phone) {
            this.errors.push("phone is requiredd");
        } else {
            this.phone = this.body.body.phone;
        }
        if (this.errors.length >= 1) {
            return { messgae: "failled", status: "300", error: this.errors };
        }

        const checkTrans = await prisma.showmax_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkTrans) return { message: "Duplicate transaction id", status: "301" };

        const productStatus = await prisma.product_categories.findFirst({ where: { name: "SHOWMAX" } });
        if (!productStatus || productStatus.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: "SHOWMAX" } });
        if (!checkSwitcher) {
            return { message: "failed", status: "300" };
        }
        const payload = JSON.stringify(this.body.body);

        const newShowMaxRequest = await prisma.showmax_requests.create({
            data: {
                request_id: this.request_id,
                subscription_period: this.subscriptionPeriod,
                code: this.package,
                user_id: this.user.id,
                payload,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                subscription_type: this.subscriptionType,
                trans_code: uuid(),
                name: this.package,
                customerNumber: this.phone,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), "SHOWMAX", newShowMaxRequest.trans_code, "Smile Bundle Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newShowMaxRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkSmileRequest = await prisma.showmax_requests.findUnique({ where: { trans_code } });
        if (!checkSmileRequest) return { message: "failed", status: "300" };
        try {
            await prisma.transactions.create({
                data: {
                    reference: checkSmileRequest.request_id,
                    amount: Number(this.amount),
                    source: checkSmileRequest.biller_id.toString(),
                    status: "ZERO",
                    channel: "B2B",
                    request_id: trans_code,
                    payment_method: reference,
                    description: "Smile Bundle Purchase",
                    destination: checkSmileRequest.customerNumber,
                    user_id: checkSmileRequest.user_id,
                    product_category_id: checkSmileRequest.category_id,
                    payment_status: "ZERO",
                },
            });
            const commission = new CommissionController(trans_code, "SHOWMAX");
            await commission.disubrse();
            const { data } = await axios.post(config.shago.testUrl, { serviceCode: "SHL" }, { headers: { hashKey: config.shago.key } });
            const response = data as unknown as showMaxPaymentResponse;
            if (response.status === "200") {
                try {
                    Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.smiledata_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
                } catch (error) {
                    logger.error(error);
                    return { message: "failed", status: "300" };
                }
                return { ...response };
            }
        } catch (error) {
            try {
                Promise.all([await prisma.smiledata_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(this.amount), "SHOWMAX", trans_code, "REVERSAL_SMILE_RECHARGE");
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
