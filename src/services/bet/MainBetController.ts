import { users } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../models/prisma";
import { validateBet } from "./validate";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { logger } from "../../utils/logger";
import { BetPaymentController } from "./payment";
import { CommissionController } from "../../helpers/CommissionController";

export class MainBetController {
    constructor(public body: Request, public user: users) {
        this.user = user;
        this.body = body;
    }
    public type = "";
    public biller = "";
    public customerId = "";
    public errors: string[] = [];
    public categoryName = "";
    public request_id = "";
    public amount = 0;
    public name = "";

    async validate() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.biller) {
            this.errors.push("biller is required");
        } else {
            this.biller = this.body.body.biller;
        }
        if (!this.body.body.customerId) {
            this.errors.push("customerId is required");
        } else {
            this.customerId = this.body.body.customerId;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        this.categoryName = this.body.body.type;
        const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: this.categoryName } });
        if (!checkProductCategory || checkProductCategory.status === "1") {
            return { message: "product not yet available for purchase", status: "400" };
        }
        const getSwitcher = await prisma.switchers.findFirst({ where: { name: this.categoryName } });
        if (!getSwitcher) return { message: "failed", status: "400" };
        const validateCustomer = await validateBet(this.customerId, getSwitcher?.biller_id, this.biller);
        return { ...validateCustomer };
    }
    async purchase() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.biller) {
            this.errors.push("biller is required");
        } else {
            this.biller = this.body.body.biller;
        }
        if (!this.body.body.customerId) {
            this.errors.push("customerId is required");
        } else {
            this.customerId = this.body.body.customerId;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is required");
        } else {
            this.amount = this.body.body.amount;
        }
        if (!this.body.body.name) {
            this.errors.push("name is required");
        } else {
            this.name = this.body.body.name;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        const checkTrans = await prisma.transactions.findUnique({ where: { reference: this.request_id } });
        if (checkTrans) return { message: "Duplicate request Id", status: "310" };
        this.categoryName = this.body.body.type;
        const getSwitcher = await prisma.switchers.findFirst({ where: { name: this.categoryName } });
        if (!getSwitcher) return { message: "failed", status: "400" };

        const createNewBetRequest = await prisma.bet_requests.create({
            data: {
                user_id: this.user.id,
                biller_id: getSwitcher.biller_id,
                category_id: getSwitcher.category_id,
                request_id: this.request_id,
                trans_code: uuid(),
                customerId: this.customerId,
                biller: this.biller,
                type: this.type,
                name: this.name,
                amount: Number(this.amount),
            },
        });

        const wallet = new WalletController(this.user.id, Number(this.amount), "DISCO", createNewBetRequest.trans_code, "Electricity Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(createNewBetRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, reference: string) {
        const checkBet = await prisma.bet_requests.findUnique({ where: { trans_code } });
        if (!checkBet) return { message: "failed", status: "400" };
        const newTransaction = await prisma.transactions.create({
            data: {
                reference: checkBet.request_id,
                amount: Number(this.amount),
                source: checkBet.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "Bet Payment",
                destination: this.biller,
                user_id: checkBet.user_id,
                product_category_id: checkBet.category_id,
                payment_status: "ZERO",
            },
        });
        console.log(newTransaction);
        const discoPayment = new BetPaymentController(checkBet.id);
        const checkPayment = await discoPayment.buy();
        if (checkPayment?.status === "300") {
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } }), await prisma.bet_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: checkPayment.message, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(checkBet.amount), "BET", trans_code, "REVERSAL_BET");
            await wallet.credit();
            return {
                message: checkPayment.message,
                status: checkPayment.status,
            };
        }
        if (checkPayment?.status === "400") {
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.bet_requests.update({ where: { trans_code: trans_code }, data: { status: "ZERO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(checkBet.amount), "BEt", trans_code, "REVERSAL_BET");
            await wallet.credit();
            return {
                message: "failed",
                status: checkPayment.status,
            };
        }
        try {
            Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.bet_requests.update({ where: { trans_code: trans_code }, data: { status: "ONE" } })]);
        } catch (error) {
            logger.error(error);
            return { message: "failed", status: "300" };
        }
        const commission = new CommissionController(trans_code, "BET");
        await commission.disubrse();
        return {
            message: checkPayment?.message,
            status: checkPayment?.status,
            name: checkPayment?.name,
            date: checkPayment?.date,
            transId: checkPayment?.transId,
            amount: checkPayment?.amount,
            customerId: checkPayment?.customerId,
            type: checkPayment?.type,
        };
    }
}
