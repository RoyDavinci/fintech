import axios from "axios";
import config from "../../config";
import { logger } from "../../utils/logger";

export async function validateBet(customerId: string, biller_id: number, type: string): Promise<validateResponse | validateSuccessResponse> {
    switch (biller_id) {
        case 12:
            try {
                const arr = ["301", "500", "501", "100"];
                const body = { serviceCode: "BEV", type, customerId };
                const { data } = await axios.post(config.shago.testUrl, body, { headers: { hashKey: config.shago.key } });

                const response = data as unknown as validateResponse & validateSuccessResponse;
                if (arr.includes(response.status)) {
                    logger.info("yes it includes");
                    return { message: response.message, status: "300" };
                }
                if (response.status === "200") {
                    return {
                        status: response.status,
                        message: response.message,
                        name: response.name,
                        type: response.type,
                        customerId: response.customerId,
                        reference: response.reference,
                        accountNumber: response.accountNumber,
                        phoneNumber: response.phoneNumber,
                        emailAddress: response.emailAddress,
                        canVend: response.canVend,
                        minPayableAmount: response.minPayableAmount,
                        charge: response.charge,
                    };
                }
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "400" };
            }
        default:
            return { message: "failed", status: "400" };
    }
}
