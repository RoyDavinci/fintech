import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";

export class MainDstvController {
    constructor(public body: Request, public user: users) {}
    public type = "";
    public smartCardNo = "";
    public errors: string[] = [];
    public action = "";
    public code = "";

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
                type: "DSTV",
                smartCardNo: "10441003943",
            },
            { headers: { email: config.ringo.email, password: config.ringo.password } },
        );
        if (data.status === "200") {
            return { message: data.message, status: "200", product: data.product, type: data.type, smartCardNo: data.smartCardNo };
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
                return { message: data.message, status: "200", amount: data.amount, dueDate: data.dueDate, type: data.type, smartCardNo: data.smartCardNo };
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
}
