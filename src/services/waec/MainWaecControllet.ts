import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { logger } from "../../utils/logger";
import { CommissionController } from "../../helpers/CommissionController";

interface WaecValidateResponse {
    message: string;
    status: string | number;
    type?: string;
    product: [
        {
            price: number;
            availaBleCount: number;
        },
    ];
}

interface waecPaymentResponse {
    amount: number;
    message: string;
    status: string | number;
    transId: string;
    date: string;
    pin: [
        {
            pin: string;
            serial: string;
            expirydat: null;
        },
    ];
}

export class MainWaecController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }

    public errors: string[] = [];
    public pinNo = "";
    public amount = "";
    public request_id = "";
    public type = "";

    async validate() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }

        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }

        const { data } = await axios.post(config.shago.testUrl, { serviceCode: "WAV" }, { headers: { hashKey: config.shago.key } });
        const response = data as unknown as WaecValidateResponse;
        if (response.status === "200" || response.status === 200) {
            return { message: "successful", status: "200", pin_based: true, product: { price: response.product[0].price, availability: response.product[0].availaBleCount, name: null, allowance: null, validity: null, code: null }, type: "WAEC" };
        }
        return { message: response.message, status: response.status };
    }
    async purchase() {
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
        if (!this.body.body.pinNo) {
            this.errors.push("pin number is required");
        } else {
            this.pinNo = this.body.body.pinNo;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }

        const checkWaec = await prisma.waec_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkWaec) return { message: "Duplicate request id", status: "301" };
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const createWaecRequest = await prisma.waec_requests.create({
            data: { user_id: this.user.id, biller_id: checkSwitcher.biller_id, category_id: checkSwitcher.category_id, request_id: this.request_id, trans_code: uuid().slice(0.1), amount: Number(this.amount), pinNo: Number(this.pinNo) },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, createWaecRequest.trans_code, "Waec Pin Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(createWaecRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, reference: string) {
        const checkWaec = await prisma.waec_requests.findUnique({ where: { trans_code } });
        if (!checkWaec) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkWaec.request_id,
                amount: Number(this.amount),
                source: checkWaec.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "WAEC Purchase",
                destination: checkWaec.bundle,
                user_id: checkWaec.user_id,
                product_category_id: checkWaec.category_id,
                payment_status: "ZERO",
            },
        });
        const { data } = await axios.post(
            config.shago.testUrl,
            {
                serviceCode: "WAP",
                numberOfPin: this.pinNo,
                amount: this.amount,
                request_id: this.request_id,
            },
            { headers: { hashKey: config.shago.key } },
        );

        const response = data as unknown as waecPaymentResponse;

        if (response.status === "200" || response.status === 200) {
            const commission = new CommissionController(trans_code, "WAEC");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.waec_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: "Successful", status: response.status, date: response.date, transRef: response.transId, amount: response.amount, transId: response.transId, pin: response.pin };
        }
        try {
            Promise.all([await prisma.waec_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
        } catch (error) {
            logger.error(error);
            return { message: error, status: "300" };
        }
        const wallet = new WalletController(this.user.id, Number(this.amount), "WAEC PURCHASE", trans_code, "REVERSAL_WAEC_RECHARGE");
        const credit = await wallet.credit();
        if (credit.message === "failed")
            return {
                message: "failed",
                status: "300",
            };

        return {
            message: response.message,
            status: response.status,
        };
    }
}
