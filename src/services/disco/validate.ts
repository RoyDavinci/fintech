import axios from "axios";
import { logger } from "../../utils/logger";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function validateDisco(disco: string, biller_id: number, meterNo: string, type: string): Promise<Partial<successResponse & failedResponse>> {
    switch (Number(biller_id)) {
        case 12:
            try {
                const { data } = await axios.post("http://test.shagopayments.com/public/api/test/b2b", { disco, meterNo, type, serviceCode: "AOV" }, { headers: { hashKey: process.env.HASHKEY } });
                const response = data as unknown as successResponse;
                if (data.status === "400") {
                    return { message: "pending", status: "300" };
                }
                if (response.status === "300") {
                    return { message: "failed", status: "400" };
                }
                return {
                    meterNo: response.meterNo,
                    accountNo: response.accountNo,
                    customerAddress: response.customerAddress,
                    customerDistrict: response.customerDistrict,
                    customerName: response.customerName,
                    type: response.type,
                    status: response.status,
                    phoneNumber: response.phoneNumber,
                    message: "successful",
                    disco,
                };
            } catch (error) {
                logger.error(error);
                return { message: "failed", status: "400" };
            }
        default:
            return { message: "failed", status: "400" };
    }
}
