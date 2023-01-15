import { users } from "@prisma/client";
import { Request } from "express";

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
    public name = "";

    async validate() {
        if (!this.body.body.name) {
            this.errors.push("name is required");
        } else {
            this.name = this.body.body.name;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
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
    }
    async giveValue() {}
}
