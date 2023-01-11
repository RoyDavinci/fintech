import { Request, Response } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { MainDiscoController } from "../services/disco/MainDiscoController";
import { logger } from "../utils/logger";

export async function mainApiController(req: Request, res: Response) {
    const { serviceCode } = req.body;

    try {
        if (!serviceCode) return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "service code is required" });
        switch (serviceCode.toUpperCase()) {
            case "V-ELECT":
                const validateDisco = new MainDiscoController(req, req.user);
                const validateDiscoFunc = await validateDisco.validate();
                return res.status(200).json({ ...validateDiscoFunc });
            case "P-ELECT":
                const payDisco = new MainDiscoController(req, req.user);
                const payDiscoFunc = await payDisco.purchase();
                return res.status(200).json({ ...payDiscoFunc });
            default:
                return res.status(200).json({ message: "yup" });
        }
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
}
