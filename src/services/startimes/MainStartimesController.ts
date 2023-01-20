import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { CommissionController } from "../../helpers/CommissionController";

export class MainStartimesController {
    constructor(public body: Request, public user: users) {
        this.user = user;
        this.body = body;
    }

    public type = "";
    public smartCardNo = "";
    public errors: string[] = [];
    public request_id = "";
    public price = "";
    public package = "";

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
            config.shago.testUrl,
            {
                serviceCode: "GDS",
                type: "STARTIMES",
                smartCardNo: this.smartCardNo,
            },
            { headers: { hashKey: config.shago.key } },
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
        if (!this.body.body.price) {
            this.errors.push("price is required");
        } else {
            this.price = this.body.body.price;
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

        const getPackageCode = await this.validate();
        if (getPackageCode.status === "200") {
            const getDetail = getPackageCode.product?.filter((item) => item.price === Number(this.price));
            if (!getDetail) {
                return { message: "product code does not exist", status: "300" };
            }
            if (getDetail.length > 0 && getDetail) {
                console.log(getDetail);
                this.package = getDetail[0].name;
            } else {
                return { message: `product code with price ${this.price} does not exist`, status: "300" };
            }
        } else {
            return { message: "failed", status: "300" };
        }

        const newTvRequest = await prisma.paytv_requests.create({
            data: {
                user_id: this.user.id,
                request_id: this.request_id,
                smartcardNumber: this.smartCardNo,
                trans_code: uuid().slice(0, 10),
                category_id: checkSwitcher.category_id,
                biller_id: checkSwitcher.biller_id,
                customerName: "",
                amount: Number(this.price),
                packagename: "STARTIMES",
                payload: JSON.stringify(this.body.body),
            },
        });
        const wallet = new WalletController(this.user.id, Number(this.price), this.type, newTvRequest.trans_code, "Ntel Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.price)) {
            logger.info("yes it is correct");
            return await this.giveValue(newTvRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.price };
        }
    }
    async giveValue(trans_code: string, reference: string) {
        const checkPayTv = await prisma.paytv_requests.findUnique({ where: { trans_code } });
        if (!checkPayTv) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkPayTv.request_id,
                amount: Number(this.price),
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
            { serviceCode: "GDB", smartCardNo: this.smartCardNo, type: "STARTIMES", customerName: "stephen", packagename: this.package, amount: 90, request_id: this.request_id },
            { headers: { hashKey: config.shago.key } },
        );
        logger.info(data);
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
            return { message: "Successful", status: response.status, date: response.date, transRef: response.transId, amount: response.amount, package: response.package, type: response.type };
        }
        try {
            Promise.all([await prisma.paytv_requests.update({ where: { trans_code }, data: { status: "TWO" } }), await prisma.transactions.update({ where: { request_id: trans_code }, data: { status: "TWO" } })]);
        } catch (error) {
            logger.error(error);
            return { message: error, status: "300" };
        }
        const wallet = new WalletController(this.user.id, Number(this.price), "TV PURCHASE", trans_code, "REVERSAL_SPECTRANET_RECHARGE");
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
