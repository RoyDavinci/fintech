import { users } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { logger } from "../../utils/logger";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainSmileController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public account = "";
    public network = "SMILE_RECHARGE";
    public name = "";
    public errors: string[] = [];
    public amount = "";
    public request_id = "";
    async validate() {
        if (!this.body.body.account) {
            this.errors.push("Account is required");
        } else {
            this.account = this.body.body.account;
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
        return { message: "Successful", status: "200", customerName: "Test Account", account_id: this.account, type: "SMILE_RECHARGE" };
    }
    async purchase() {
        if (!this.body.body.account) {
            this.errors.push("Account is required");
        } else {
            this.account = this.body.body.account;
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
        const checkSmile = await prisma.smile_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkSmile) return { message: "Duplicate request ID", status: "301" };
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: "SMILE_RECHARGE" } });
        if (!checkProduct) return { message: "Service not available yet", status: "400" };
        const switcher = await prisma.switchers.findUnique({ where: { name: "SMILE_RECHARGE" } });
        if (!switcher) return { message: "Service not available yet", status: "400" };

        const payload = JSON.stringify(this.body.body);
        logger.info(payload);
        const newSmileRequest = await prisma.smile_requests.create({
            data: {
                request_id: this.request_id,
                user_id: this.user.id,
                biller_id: switcher.biller_id,
                category_id: switcher.category_id,
                trans_code: uuid().slice(0, 10),
                customerAccountId: this.account,
                api_method: "B2B",
                payload,
                amount: Number(this.amount),
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.network, newSmileRequest.trans_code, "Smile Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newSmileRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkSmile = await prisma.smile_requests.findUnique({ where: { trans_code } });
        if (!checkSmile) return { message: "failed", status: "300" };
        try {
            await prisma.transactions.create({
                data: {
                    reference: checkSmile.request_id,
                    amount: Number(this.amount),
                    source: checkSmile.biller_id.toString(),
                    status: "ZERO",
                    channel: "B2B",
                    request_id: trans_code,
                    payment_method: reference,
                    description: "Airtime Purchase",
                    destination: checkSmile.customerAccountId,
                    user_id: checkSmile.user_id,
                    product_category_id: checkSmile.category_id,
                    payment_status: "ZERO",
                },
            });
            const commission = new CommissionController(trans_code, this.network);
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.smile_requests.update({ where: { trans_code: trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return {
                message: "transaction successful",
                status: "200",
                amount: this.amount,
                amountCharged: `${this.amount}`,
                productamount: 1,
                transref: trans_code,
                type: "SMILE_RECHARGE",
                date: new Date(),
                account_no: this.account,
            };
        } catch (error) {
            try {
                Promise.all([await prisma.airtime_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(this.amount), this.network, trans_code, "REVERSAL_SMILE_RECHARGE");
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
