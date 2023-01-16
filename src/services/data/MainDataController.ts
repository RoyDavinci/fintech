import { users } from "@prisma/client";
import { Request } from "express";
import { checkMobileNumber } from "../../common/checkNumber";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { validateData } from "./validate";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainDataController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }

    public errors: string[] = [];
    public network = "";
    public name = "";
    public number = "";
    public request_id = "";
    public product_id = "";
    public amount = 0;
    public package = "";
    async validate() {
        if (!this.body.body.network) {
            this.errors.push("network is required");
        } else {
            this.network = this.body.body.network;
        }
        if (this.errors.length >= 1) {
            return { message: this.errors, status: "500" };
        }
        if (this.network === "9mobile") this.name = "ETISALAT";
        this.name = this.network;

        const productStatus = await prisma.product_categories.findFirst({ where: { name: `${this.name.toUpperCase()}_BUNDLE` } });
        if (!productStatus || productStatus.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }

        const validateFunc = await validateData(this.name);

        return { ...validateFunc };
    }
    async payment() {
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
        if (this.errors.length >= 1) {
            return { message: this.errors, status: "500" };
        }
        const productStatus = await prisma.datah_bundles.findFirst({ where: { code: this.product_id } });
        if (!productStatus) {
            return { message: "Service not currently available", status: "500" };
        }

        if (productStatus.network.toLowerCase() === "9mobile") {
            this.name = "ETISALAT";
        } else {
            this.name = productStatus.network.toUpperCase();
        }

        const productCheck = await prisma.product_categories.findFirst({ where: { name: `${this.name.toUpperCase()}_BUNDLE` } });
        if (!productCheck || productCheck.status === "1") {
            return { message: "Service not currently available", status: "500" };
        }

        this.package = productStatus.allowance;
        this.amount = Number(productStatus.price);
        this.number.length > 11 ? (this.number.includes("+") ? this.number : (this.number = `+${this.number}`)) : this.number;
        logger.info(this.number);
        const checkPhone = checkMobileNumber(this.number.toString());
        if (!checkPhone.correct) {
            return { message: checkPhone.message, status: checkPhone.status };
        }

        const payload = JSON.stringify(this.body.body);
        logger.info(this.name);
        const checkSwitcher = await prisma.switchers.findFirst({ where: { name: `${this.name.toUpperCase()}_BUNDLE` } });
        if (!checkSwitcher) {
            return { message: "failed", status: "300" };
        }

        const checkData = await prisma.data_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkData) return { message: "Duplicate request Id", status: "310" };

        const newData = await prisma.data_requests.create({
            data: {
                user_id: this.user.id,
                network: this.network,
                package: productStatus.category,
                amount: productStatus.price,
                request_id: this.request_id,
                phone_number: this.number,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                trans_code: uuid(),
                payload,
            },
        });
        const wallet = new WalletController(this.user.id, Number(productStatus.price), "DATA", newData.trans_code, "Data Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(productStatus.price)) {
            logger.info("yes it is correct");
            return await this.giveValue(newData.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: productStatus.price };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkData = await prisma.data_requests.findUnique({ where: { trans_code: trans_code } });
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
                    description: "Data Purchase",
                    destination: checkData.phone_number,
                    user_id: checkData.user_id,
                    product_category_id: checkData.category_id,
                    payment_status: "ZERO",
                },
            });
            const commission = new CommissionController(trans_code, "DATA");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } }), await prisma.data_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: "Successful", status: "200", transId: trans_code, amount: this.amount, date: new Date().getDate(), phone: this.number, package: this.package };
        } catch (error) {
            try {
                Promise.all([await prisma.data_requests.update({ where: { trans_code: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, this.amount, "DATA", trans_code, "REVERSAL_DATA");
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
