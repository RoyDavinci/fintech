import axios from "axios";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";

export class BetPaymentController {
    constructor(public unique_id: number) {
        this.unique_id = unique_id;
    }

    async payShago(): Promise<Partial<validateResponse & paymentSuccessfulResponse>> {
        const checkBet = await prisma.bet_requests.findUnique({ where: { id: this.unique_id } });
        if (!checkBet) return { message: "failed", status: "400" };
        const arr = ["301", "500", "501", "100"];
        console.log("checkBet", checkBet);
        const body = { serviceCode: "BEP", type: checkBet.biller, customerId: checkBet.customerId, request_id: checkBet.trans_code, name: checkBet.name, amount: Number(checkBet.amount), reference: "" };
        const { data } = await axios.post(config.shago.testUrl, body, { headers: { hashKey: config.shago.key } });
        await prisma.bet_requests.update({ where: { id: this.unique_id }, data: { payload: `${body}${config.shago.testUrl}`, response: JSON.stringify(data) } });
        const response = data as unknown as paymentSuccessfulResponse & validateResponse;
        if (arr.includes(data.response)) {
            logger.info("yes it includes");
            return { message: response.message, status: "300" };
        }
        return { message: response.message, status: response.status, name: response.name, date: response.date, transId: response.transId, amount: response.amount, customerId: response.customerId, type: response.type };
    }

    async buy() {
        const checkBet = await prisma.bet_requests.findUnique({ where: { id: this.unique_id } });
        if (Number(checkBet?.biller_id) === 12) {
            return this.payShago();
        }
    }
}
