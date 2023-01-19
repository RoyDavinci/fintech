import axios from "axios";
import config from "../../config";
import { prisma } from "../../models/prisma";

export class NtelPurchaseController {
    constructor(public reference: number, public type: string) {
        this.reference = reference;
        this.type = type;
    }
    async purchase() {
        const checkItem = await prisma.ntel_requests.findUnique({ where: { id: this.reference } });
        if (!checkItem) return { message: "transaction does not exist", status: "300" };

        if (this.type === "NTOP") {
            const { data } = await axios.post(config.shago.testUrl, { serviceCode: "NVT", amount: checkItem.amount, phone: checkItem.customerNumber, request_id: checkItem.trans_code });
        }
    }
}
