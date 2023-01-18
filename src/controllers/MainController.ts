import { Request, Response } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { MainAirtimeController } from "../services/aitrime/MainAirtimeCoontroller";
import { MainBetController } from "../services/bet/MainBetController";
import { MainDataController } from "../services/data/MainDataController";
import { MainDiscoController } from "../services/disco/MainDiscoController";
import { MainShowMaxController } from "../services/Showmax/MainShowMaxController";
import { MainSmileBundleController } from "../services/smile/MainSmileBundleController";
import { MainSmileController } from "../services/smile/MainSmileController";
import { logger } from "../utils/logger";

export async function mainApiController(req: Request, res: Response) {
    const { serviceCode } = req.body;

    try {
        if (!serviceCode) return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "service code is required" });
        logger.info(serviceCode);
        switch (serviceCode) {
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
            case "DTA":
                const fetchData = new MainDataController(req, req.user);
                const fetchDataFunc = await fetchData.validate();
                return res.status(fetchDataFunc.status ? Number(fetchDataFunc.status) : 200).json({ ...fetchDataFunc });
            case "ADA":
                const buyData = new MainDataController(req, req.user);
                const buyDataFunc = await buyData.payment();
                return res.status(buyDataFunc.status ? Number(buyDataFunc.status) : 200).json({ ...buyDataFunc });
            case "VAR":
                const buyAirtime = new MainAirtimeController(req, req.user);
                const buyAirtimeFunc = await buyAirtime.purchase();
                return res.status(buyAirtimeFunc.status ? Number(buyAirtimeFunc.status) : 200).json({ ...buyAirtimeFunc });
            case "SRV":
                const validateSmileRecharge = new MainSmileController(req, req.user);
                const validateSmileRechargeFunc = await validateSmileRecharge.validate();
                return res.status(validateSmileRechargeFunc.status ? Number(validateSmileRechargeFunc.status) : 200).json({ ...validateSmileRechargeFunc });
            case "SRP":
                const paySmileRecharge = new MainSmileController(req, req.user);
                const paySmileRechargeFunc = await paySmileRecharge.purchase();
                return res.status(paySmileRechargeFunc.status ? Number(paySmileRechargeFunc.status) : 200).json({ ...paySmileRechargeFunc });
            case "V-Internet":
                const validateSmileBundle = new MainSmileBundleController(req, req.user);
                const validateSmileBundleFunc = await validateSmileBundle.validate();
                return res.status(validateSmileBundleFunc.status ? Number(validateSmileBundleFunc.status) : 200).json({ ...validateSmileBundleFunc });
            case "P-Internet":
                const paymentSmileBundle = new MainSmileBundleController(req, req.user);
                const paymentSmileBundleFunc = await paymentSmileBundle.purchase();
                return res.status(paymentSmileBundleFunc.status ? Number(paymentSmileBundleFunc.status) : 200).json({ ...paymentSmileBundleFunc });
            case "SHVAL":
                const validateShowMax = new MainShowMaxController(req, req.user);
                const validateShowMaxFunc = await validateShowMax.validate();
                return res.status(validateShowMaxFunc.status ? Number(validateShowMaxFunc.status) : 200).json({ ...validateShowMaxFunc });
            case "SHPAY":
                const showmaxPayment = new MainShowMaxController(req, req.user);
                const showmaxPaymentFunc = await showmaxPayment.validate();
                return res.status(showmaxPaymentFunc.status ? Number(showmaxPaymentFunc.status) : 200).json({ ...showmaxPaymentFunc });
            default:
                return res.status(400).json({ message: "invalid service code supplied" });
        }
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
}
