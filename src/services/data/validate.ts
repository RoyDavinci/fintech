import axios from "axios";
import config from "../../config";
import { logger } from "../../utils/logger";

export async function validateData(network: string): Promise<Partial<validatDataResponse & failedResponse>> {
    const arr = ["301", "500", "501", "100", "300", "301"];
    try {
        const body = {
            serviceCode: "VDA",
            network: network.toUpperCase(),
        };
        const { data } = await axios.post(config.shago.testUrl, body, { headers: { hashKey: config.shago.key } });
        const response = data as unknown as validatDataResponse;
        if (arr.includes(response.status)) {
            logger.info("yes it includes");
            return { message: response.message, status: "300" };
        }
        return { message: "successful", status: "200", product: response.product };
    } catch (error) {
        logger.error(error);
        return { message: "failed", status: "300" };
    }
}
