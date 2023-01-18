import { users } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { product } from "./test";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainSmileBundleController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public account = "";
    public network = "SMILE_BUNDLE";
    public name = "";
    public errors: string[] = [];
    public price = "";
    public code = "";
    public allowance = "";
    public request_id = "";
    public type = "";
    async validate() {
        if (!this.body.body.account) {
            this.errors.push("Account is required");
        } else {
            this.account = this.body.body.account;
        }
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (this.errors.length >= 1) {
            return { status: "400", error: this.errors };
        }

        const productStatus = await prisma.product_categories.findFirst({ where: { name: this.network } });
        if (!productStatus || productStatus.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: this.network } });
        if (!checkSwitcher) {
            return { message: "failed", status: "300" };
        }
        return { message: "Successful", status: "200", customerName: "Sunday Ojo ", product, account_id: this.account, type: "SMILE_BUNDLE", pin_based: false };
    }
    async purchase() {
        if (!this.body.body.account) {
            this.errors.push("Account is required");
        } else {
            this.account = this.body.body.account;
        }
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.price) {
            this.errors.push("price is required");
        } else {
            this.price = this.body.body.price;
        }
        if (!this.body.body.allowance) {
            this.errors.push("allowance is required");
        } else {
            this.allowance = this.body.body.allowance;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (this.errors.length >= 1) {
            return { status: "400", error: this.errors };
        }

        const checkTrans = await prisma.smiledata_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkTrans) return { message: "Duplicate request id", status: "301" };
        const productStatus = await prisma.product_categories.findFirst({ where: { name: this.network } });
        if (!productStatus || productStatus.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: this.network } });
        if (!checkSwitcher) {
            return { message: "failed", status: "300" };
        }
        const payload = JSON.stringify(this.body.body);
        logger.info(payload);
        const newSmileRequest = await prisma.smiledata_requests.create({
            data: {
                request_id: this.request_id,
                user_id: this.user.id,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                trans_code: uuid().slice(0, 10),
                payload,
                amount: Number(this.price),
                account_id: this.account,
                network: this.name,
                package: this.allowance,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.price), this.network, newSmileRequest.trans_code, "Smile Bundle Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.price)) {
            logger.info("yes it is correct");
            return await this.giveValue(newSmileRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.price };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkSmile = await prisma.smiledata_requests.findUnique({ where: { trans_code } });
        if (!checkSmile) return { message: "failed", status: "300" };
        try {
            await prisma.transactions.create({
                data: {
                    reference: checkSmile.request_id,
                    amount: Number(this.price),
                    source: checkSmile.biller_id.toString(),
                    status: "ZERO",
                    channel: "B2B",
                    request_id: trans_code,
                    payment_method: reference,
                    description: "Smile Bundle Purchase",
                    destination: checkSmile.account_id,
                    user_id: checkSmile.user_id,
                    product_category_id: checkSmile.category_id,
                    payment_status: "ZERO",
                },
            });
            const commission = new CommissionController(trans_code, this.network);
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.smiledata_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: "Successful", status: "200", TransRef: trans_code, date: "", amount: this.price, amountCharged: this.price, pin_based: false };
        } catch (error) {
            try {
                Promise.all([await prisma.smiledata_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(this.price), this.network, trans_code, "REVERSAL_SMILE_RECHARGE");
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
