import { Request, Response } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { MainBetController } from "../services/bet/MainBetController";
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
                return res.status(payDiscoFunc.status ? Number(payDiscoFunc.status) : 200).json({ ...payDiscoFunc });
            case "BDV":
                const validateBet = new MainBetController(req, req.user);
                const validateBetFunc = await validateBet.validate();
                return res.status(validateBetFunc.status ? Number(validateBetFunc.status) : 200).json({ ...validateBetFunc });
            case "BDP":
                const payBet = new MainBetController(req, req.user);
                const payBetFunc = await payBet.purchase();
                return res.status(payBetFunc.status ? Number(payBetFunc.status) : 200).json({ ...payBetFunc });
            default:
                return res.status(200).json({ message: "yup" });
        }
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
}
