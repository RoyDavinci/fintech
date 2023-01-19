import { users } from "@prisma/client";
import axios from "axios";
import { Request } from "express";
import config from "../../config";
import { prisma } from "../../models/prisma";

export class MainTollController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }
    public type = "";
    public customerId = "";
    public reference = "";
    public amount = "";
    public request_id = "";
    public errors: string[] = [];
    async validate() {
        if (!this.body.body.customerId) {
            this.errors.push("customer ID is required");
        } else {
            this.customerId = this.body.body.customerId;
        }
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
                serviceCode: "LEV",
                type: "LCC",
                customerId: "1234-00",
            },
            { headers: { hashKey: config.shago.key } },
        );
        const response = data as unknown as LccResponse;
        if (response.status === "200") {
            return {
                message: response.message,
                emailAddress: response.emailAddress,
                name: response.name,
                accountNumber: response.accountNumber,
                status: response.status,
                canVend: response.canVend,
                reference: response.reference,
                wallet: response.wallet,
                type: response.type,
                phoneNumber: response.phoneNumber,
            };
        } else {
            return { message: response.message, status: response.status };
        }
    }
}
