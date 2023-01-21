import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { logger } from "../../utils/logger";
import { CommissionController } from "../../helpers/CommissionController";

export class MainDstvController {
    constructor(public body: Request, public user: users) {}
    public type = "";
    public smartCardNo = "";
    public errors: string[] = [];
    public action = "";
    public code = "";
    public request_id = "";
    public hasAddon = "";
    public name = "";
    public customerName = "";
    public addonDetails = {
        name: "",
        addonCode: "",
    };
    public period = "";
    public amount: number = 0;

    async validate(): Promise<tvValidateResponse> {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.smartCardNo) {
            this.errors.push("smartCardNo is required");
        } else {
            this.smartCardNo = this.body.body.smartCardNo;
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
            config.ringo.url,
            {
                serviceCode: "V-TV",
                type: "DSTV",
                smartCardNo: "10441003943",
            },
            { headers: { email: config.ringo.email, password: config.ringo.password } },
        );
        const response = data as unknown as tvValidateResponse;
        if (response.status === "200") {
            return { message: response.message, status: "200", product: response.product, type: response.type, smartCardNo: response.smartCardNo };
        }
        return { message: "failed", status: "300" };
    }
    async multichoice() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.smartCardNo) {
            this.errors.push("smartCardNo is required");
        } else {
            this.smartCardNo = this.body.body.smartCardNo;
        }
        if (!this.body.body.action) {
            this.errors.push("action is required");
        } else {
            this.action = this.body.body.action;
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
        if (this.action === "GET_DUE_DATE_AMOUNT") {
            const { data } = await axios.post(
                config.ringo.url,
                {
                    serviceCode: "MULTICHOICE",
                    type: "DSTV",
                    action: "GET_DUE_DATE_AMOUNT",
                    smartCardNo: "1044052552",
                },
                { headers: { email: config.ringo.email, password: config.ringo.password } },
            );
            if (data.status === "200") {
                return { message: data.message, status: "200", amount: data.amount, dueDate: data.dueDate, type: data.type, smartCardNo: data.smartCardNo };
            }
            return { message: "failed", status: "300" };
        }
        if (this.action === "GET_CURRENT_SUBSCRIPTION") {
            const { data } = await axios.post(
                config.shago.testUrl,
                {
                    serviceCode: "MULTICHOICE",
                    type: "DSTV",
                    action: "GET_CURRENT_SUBSCRIPTION",
                    smartCardNo: "1044052552",
                },
                { headers: { hashKey: config.shago.key } },
            );
            if (data.status === "200") {
                return { message: data.message, status: "200", amount: data.amount, dueDate: data.dueDate, type: data.type, smartCardNo: data.smartCardNo, packages: data.packages };
            }
            return { message: "failed", status: "300" };
        }

        const { data } = await axios.post(
            config.ringo.url,
            {
                serviceCode: "MULTICHOICE",
                type: "DSTV",
                action: "CHECK_BOX_OFFICE",
                smartCardNo: "1052097216",
            },
            { headers: { email: config.ringo.email, password: config.ringo.password } },
        );
        if (data.status === "200") {
            return { message: data.message, status: "200", isBoxOffice: data.isBoxOffice, type: data.type, smartCardNo: data.smartCardNo };
        }
        return { message: "failed", status: "300" };
    }
    async fetchAddon() {
        if (!this.body.body.code) {
            this.errors.push("code is required");
        } else {
            this.code = this.body.body.code;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        const { data } = await axios.post(
            config.ringo.addonUrl,
            {
                code: "PRWE36",
            },
            { headers: { email: config.ringo.email, password: config.ringo.password } },
        );
        if (data.status === "200") {
            return { message: data.message, status: "200", product: data.product };
        }
        return { message: "failed", status: "300" };
    }
    async purchase() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.smartCardNo) {
            this.errors.push("smartCardNo is required");
        } else {
            this.smartCardNo = this.body.body.smartCardNo;
        }
        if (!this.body.body.period) {
            this.errors.push("period is required");
        } else {
            this.period = this.body.body.period;
        }
        if (!this.body.body.code) {
            this.errors.push("code is required");
        } else {
            this.code = this.body.body.code;
        }
        if (!this.body.body.name) {
            this.errors.push("name is required");
        } else {
            this.name = this.body.body.name;
        }

        if (!this.body.body.hasAddon) {
            this.errors.push("hasAddon is required");
        } else {
            this.hasAddon = this.body.body.hasAddon;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        const checkDstv = await prisma.paytv_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkDstv) return { message: "Duplicate request Id", status: "301" };
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }

        let getAmount = await this.validate();
        if (getAmount.status === "200") {
            const getDetail = getAmount.product?.filter((item) => item.code === this.code);
            if (!getDetail) {
                return { message: "product code does not exist", status: "300" };
            }
            if (getDetail.length > 0 && getDetail) {
                console.log(getDetail);
                this.amount = getDetail[0].price;
            } else {
                return { message: "product code does not exist", status: "300" };
            }
        } else {
            return { message: "failed", status: "300" };
        }
        const newTvRequest = await prisma.paytv_requests.create({
            data: {
                user_id: this.user.id,
                request_id: this.request_id,
                period: Number(this.period),
                smartcardNumber: this.smartCardNo,
                trans_code: uuid().slice(0, 10),
                category_id: checkSwitcher.category_id,
                biller_id: checkSwitcher.biller_id,
                customerName: this.name,
                amount: this.amount,
                packagename: this.name,
                payload: JSON.stringify(this.body.body),
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, newTvRequest.trans_code, "Dstv Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newTvRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async multiPay() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
        }
        if (!this.body.body.smartCardNo) {
            this.errors.push("smartCardNo is required");
        } else {
            this.smartCardNo = this.body.body.smartCardNo;
        }
        if (!this.body.body.period) {
            this.errors.push("period is required");
        } else {
            this.period = this.body.body.period;
        }
        if (!this.body.body.code) {
            this.errors.push("code is required");
        } else {
            this.code = this.body.body.code;
        }
        if (!this.body.body.packagename) {
            this.errors.push("packagename is required");
        } else {
            this.name = this.body.body.packagename;
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
        this.customerName = this.body.body.customerName;
        const checkDstv = await prisma.paytv_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkDstv) return { message: "Duplicate request Id", status: "301" };
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const newTvRequest = await prisma.paytv_requests.create({
            data: {
                user_id: this.user.id,
                request_id: this.request_id,
                period: Number(this.period),
                smartcardNumber: this.smartCardNo,
                trans_code: uuid().slice(0, 10),
                category_id: checkSwitcher.category_id,
                biller_id: checkSwitcher.biller_id,
                customerName: this.customerName,
                amount: this.amount,
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.amount), this.type, newTvRequest.trans_code, "Dstv Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(newTvRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, reference: string) {
        const checkPayTv = await prisma.paytv_requests.findUnique({ where: { trans_code } });
        if (!checkPayTv) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkPayTv.request_id,
                amount: Number(this.amount),
                source: checkPayTv.biller_id.toString(),
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "DSTV Purchase",
                destination: checkPayTv.customerName,
                user_id: checkPayTv.user_id,
                product_category_id: checkPayTv.category_id,
                payment_status: "ZERO",
            },
        });
        if (this.hasAddon === "True" || this.hasAddon === "1") {
            if (!this.body.body.addondetails) {
                this.errors.push("addonDetails is required");
            } else {
                this.addonDetails = this.body.body.addondetails;
            }
            if (!this.body.body.addondetails.name) {
                this.errors.push("addon details name is required");
            }
            if (!this.body.body.addondetails.addoncode) {
                this.errors.push("addon details addonCode is required");
            }
            if (this.errors.length >= 1) {
                return { message: "failed", error: this.errors, status: "300" };
            }
            const { data } = await axios.post(
                config.shago.testUrl,
                {
                    serviceCode: "GDB ",
                    smartCardNo: "2022188682",
                    customerName: "Sten Sten ",
                    type: "DSTV ",
                    amount: "7900",
                    packagename: this.name,
                    productsCode: "COMPE36",
                    period: "1",
                    hasAddon: "1",
                    addonproductCode: "ASIADDE36 ",
                    addonAmount: "6200",
                    addonproductName: "Asian Addon",
                    request_id: trans_code,
                },
                { headers: { hashKey: config.shago.key } },
            );
            await prisma.paytv_requests.update({ where: { trans_code }, data: { response: JSON.stringify(data), addondetails: JSON.stringify(this.addonDetails) } });
            const response = data as unknown as tvPaymentResponse;
            if (response.status === "200") {
                const commission = new CommissionController(trans_code, "TV");
                await commission.disubrse();
                try {
                    Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.paytv_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
                } catch (error) {
                    logger.error(error);
                    return { message: "failed", status: "300" };
                }
                return { message: response.message, status: response.status, date: response.date, transId: response.transId, amount: response.amount, package: response.package, type: response.type };
            }
            try {
                Promise.all([await prisma.paytv_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
            } catch (error) {
                logger.error(error);
                return { message: error, status: "300" };
            }
            const wallet = new WalletController(this.user.id, Number(this.amount), "TV PURCHASE", trans_code, "REVERSAL_SPECTRANET_RECHARGE");
            const credit = await wallet.credit();
            if (credit.message === "failed")
                return {
                    message: "failed",
                    status: "300",
                };

            return {
                message: response.message,
                status: "300",
            };
        }
        const { data } = await axios.post(
            config.shago.testUrl,
            {
                serviceCode: "GDB ",
                smartCardNo: checkPayTv.smartcardNumber,
                customerName: checkPayTv.customerName,
                type: "DSTV ",
                amount: this.amount,
                packagename: this.name,
                productsCode: this.code,
                period: this.period,
                hasAddon: "0",
                request_id: trans_code,
            },
            { headers: { hashKey: config.shago.key } },
        );
        await prisma.paytv_requests.update({ where: { trans_code }, data: { response: JSON.stringify(data), addondetails: JSON.stringify(this.addonDetails) } });
        const response = data as unknown as tvPaymentResponse;
        if (response.status === "200") {
            const commission = new CommissionController(trans_code, "TV");
            await commission.disubrse();
            try {
                Promise.all([await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "ONE" } }), await prisma.paytv_requests.update({ where: { trans_code }, data: { status: "ONE" } })]);
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "300" };
            }
            return { message: response.message, status: response.status, date: response.date, transId: response.transId, amount: response.amount, package: response.package, type: response.type };
        }
        try {
            Promise.all([await prisma.paytv_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
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
            message: response.message,
            status: "300",
        };
    }
}
