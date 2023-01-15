import { users } from "@prisma/client";
import { Request } from "express";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { validateData } from "./validate";

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
        return { message: "", status: "" };
    }
    async giveValue() {}
}
