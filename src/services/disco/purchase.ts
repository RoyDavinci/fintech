import { PrismaClient } from "@prisma/client";
import axios from "axios";
import config from "../../config";
import { validateDisco } from "./validate";

export class PayDisco {
    constructor(public unique_id: number) {
        this.unique_id = unique_id;
    }

    public prisma = new PrismaClient();

    async payShago() {
        const checkDisco = await this.prisma.disco_requests.findUnique({ where: { id: this.unique_id } });
        if (!checkDisco) return { message: "failed", status: "400" };
        const response = await validateDisco(checkDisco.disco_type, checkDisco?.biller_id, checkDisco?.meterNo, checkDisco?.type);
        const body = {
            serviceCode: "AOB",
            disco: checkDisco?.api_method,
            phone_number: checkDisco?.phoneNumber,
            meterNo: checkDisco?.meterNo,
            type: checkDisco?.type,
            amount: checkDisco?.amount,
            name: response.customerName,
            address: response.customerAddress,
            request_id: checkDisco.trans_code,
        };
        const { data } = await axios.post(config.shago.testUrl, body, { headers: { hashKey: config.shago.key } });

        await this.prisma.disco_requests.update({ where: { id: this.unique_id }, data: { payload: `${body}${config.shago.testUrl}`, response: data } });
    }

    async buy() {
        const checkDisco = await this.prisma.disco_requests.findUnique({ where: { id: this.unique_id } });
        if (Number(checkDisco?.biller_id) === 12) {
            return this.payShago();
        }
    }
}
