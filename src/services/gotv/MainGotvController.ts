import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { WalletController } from "../../helpers/wallet/WalletController";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { logger } from "../../utils/logger";
import { CommissionController } from "../../helpers/CommissionController";

export class MainGotvController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }

    public type = "";
    public smartCardNo = "";
    public errors: string[] = [];
    public code = "";
    public request_id = "";
    public name = "";
    public period = "";
    public amount = 0;

    async validate() {
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
                type: "GOTV",
                smartCardNo: this.smartCardNo,
            },
            { headers: { email: config.ringo.email, password: config.ringo.password } },
        );
        const response = data as unknown as tvValidateResponse;
        if (response.status === "200" || response.status === 200) {
            return { message: response.message, status: "200", product: response.product, type: response.type, smartCardNo: response.smartCardNo };
        }
        return { message: response.message, status: "300" };
    }

    async purchase() {
        if (!this.body.body.type) {
            this.errors.push("type is required");
        } else {
            this.type = this.body.body.type;
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
        if (!this.body.body.smartCardNo) {
            this.errors.push("smartCardNo is required");
        } else {
            this.smartCardNo = this.body.body.smartCardNo;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        const checkGotv = await prisma.paytv_requests.findUnique({ where: { request_id: this.request_id } });
        logger.info(this.request_id);
        logger.info(checkGotv);
        if (checkGotv) return { message: "Duplicate request Id", status: "301" };
        const checkProduct = await prisma.product_categories.findFirst({ where: { name: this.type } });
        if (!checkProduct || checkProduct.status === "1") {
            return { message: "product not available for purchase yet", status: "301", product: this.type };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: this.type } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301", product: this.type };
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
                description: "GOTV Purchase",
                destination: checkPayTv.customerName,
                user_id: checkPayTv.user_id,
                product_category_id: checkPayTv.category_id,
                payment_status: "ZERO",
            },
        });

        const { data } = await axios.post(
            config.shago.testUrl,
            { serviceCode: "GDB", request_id: this.request_id, amount: this.amount, type: "GOTV", smartCardNo: this.smartCardNo, customerName: "X", hasAddon: "0", packagename: this.name, productsCode: this.code, period: this.period },
            { headers: { hashKey: config.shago.key } },
        );

        const response = data as unknown as tvPaymentResponse;
        if (response.status === "200" || response.status === 200) {
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
}
