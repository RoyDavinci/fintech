import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainSpectranetController {
    constructor(public body: Request, public user: users) {
        this.user = user;
        this.body = body;
    }

    public amount = "";
    public request_id = "";
    public pinNo = "";
    public type = "";
    public errors: string[] = [];

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
        const { data } = await axios.post(
            config.shago.testUrl,
            {
                serviceCode: "SPV",
            },
            { headers: { hashKey: config.shago.key } },
        );
        if (data.status === "200") {
            return { message: data.message, status: "200", product: data.product, type: data.type };
        }
        return { message: "failed", status: "300" };
    }

    async purchase() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.pinNo) {
            this.errors.push("pinNo is required");
        } else {
            this.pinNo = this.body.body.pinNo;
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
            return { message: "failed", error: this.errors, status: "300" };
        }
        const checkSpectranet = await prisma.spectranet_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkSpectranet) return { message: "Duplicate request id", status: "310" };
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
        const newSpectranetRequest = await prisma.spectranet_requests.create({
            data: {
                amount: Number(this.amount),
                request_id: this.request_id,
                trans_code: uuid().slice(0, 10),
                network: "Spectranet Pins",
                category_id: checkSwitcher.category_id,
                biller_id: checkSwitcher.biller_id,
                package: "Spectranet",
                user_id: this.user.id,
                pinNo: Number(this.pinNo),
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, newSpectranetRequest.trans_code, "Spectranet Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newSpectranetRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkSpectranet = await prisma.spectranet_requests.findUnique({ where: { trans_code } });
        if (!checkSpectranet) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkSpectranet.request_id,
                amount: Number(this.amount),
                source: checkSpectranet.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "Spectranet Recharge Purchase",
                destination: checkSpectranet.network,
                user_id: checkSpectranet.user_id,
                product_category_id: checkSpectranet.category_id,
                payment_status: "ZERO",
            },
        });
        const { data } = await axios.post(
            config.shago.testUrl,
            { serviceCode: "SPB", amount: checkSpectranet.amount, type: "SPECTRANET", pinNo: checkSpectranet.pinNo, request_id: checkSpectranet.trans_code },
            { headers: { hashKey: config.shago.key } },
        );
        const response = data as unknown as paymentSpectranetResponse;
        if (response.status === "200") {
            const commission = new CommissionController(trans_code, "SPECTRANET");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.spectranet_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: response.message, status: response.status, date: response.date, transId: response.transId, transactionRef: response.transactionRef, amount: response.amount, pin: response.pin };
        }
        try {
            Promise.all([await prisma.spectranet_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
        } catch (error) {
            logger.error(error);
            return { message: error, status: "300" };
        }
        const wallet = new WalletController(this.user.id, Number(this.amount), "SPECTRANET", trans_code, "REVERSAL_SPECTRANET_RECHARGE");
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
