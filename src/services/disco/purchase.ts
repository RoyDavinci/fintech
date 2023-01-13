import axios from "axios";
import config from "../../config";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";
import { validateDisco } from "./validate";

export class PayDisco {
    constructor(public unique_id: number) {
        this.unique_id = unique_id;
    }

    async payShago(): Promise<Partial<electrictyPaymentResponse & failedResponse>> {
        const arr = ["301", "500", "501", "100"];
        const checkDisco = await prisma.disco_requests.findUnique({ where: { id: this.unique_id } });
        if (!checkDisco) return { message: "failed", status: "400" };
        const response = await validateDisco(checkDisco.disco_type, checkDisco?.biller_id, checkDisco?.meterNo, checkDisco?.type);
        const body = {
            serviceCode: "AOB",
            disco: checkDisco?.disco_type,
            phone_number: checkDisco?.phoneNumber,
            meterNo: checkDisco?.meterNo,
            type: checkDisco?.type,
            amount: checkDisco?.amount,
            name: response.customerName,
            address: response.customerAddress,
            request_id: checkDisco.trans_code,
        };
        const { data } = await axios.post(config.shago.testUrl, body, { headers: { hashKey: config.shago.key } });

        await prisma.disco_requests.update({ where: { id: this.unique_id }, data: { payload: `${body}${config.shago.testUrl}`, response: JSON.stringify(data) } });

        const paymentResponse = data as unknown as shagoResponse;
        if (paymentResponse.status === "200") {
            return {
                token: paymentResponse.token,
                unit: paymentResponse.unit,
                status: "200",
                message: "Successful",
                customerName: paymentResponse.customerName,
                TransRef: paymentResponse.transId,
                disco: paymentResponse.disco,
                date: paymentResponse.date,
                amountCharged: checkDisco.amount?.toString(),
            };
        }
        if (paymentResponse.status === "300") {
            return { message: "failed", status: "300" };
        }
        if (arr.includes(paymentResponse.status)) {
            logger.info("yes it includes");
            return { message: paymentResponse.message, status: "300" };
        }
        return { message: "pending", status: "400" };
    }

    async buy() {
        const checkDisco = await prisma.disco_requests.findUnique({ where: { id: this.unique_id } });
        if (Number(checkDisco?.biller_id) === 12) {
            return this.payShago();
        }
    }
}
