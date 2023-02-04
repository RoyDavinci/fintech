import { Request, Response, Express } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { MainAirtimeController } from "../services/aitrime/MainAirtimeCoontroller";
import { MainBetController } from "../services/bet/MainBetController";
import { MainDataController } from "../services/data/MainDataController";
import { MainDataHubController } from "../services/dataHub/MainDataHubController";
import { MainDiscoController } from "../services/disco/MainDiscoController";
import { MainDstvController } from "../services/dstv/MainDstvController";
import { MainGotvController } from "../services/gotv/MainGotvController";
import { getUserInfo } from "../services/info/userInfo";
import { MainNtelController } from "../services/ntel/MainNtelController";
import { MainShowMaxController } from "../services/Showmax/MainShowMaxController";
import { MainSmileBundleController } from "../services/smile/MainSmileBundleController";
import { MainSmileController } from "../services/smile/MainSmileController";
import { MainSpectranetController } from "../services/spectranet/MainSpectranetController";
import { MainStartimesController } from "../services/startimes/MainStartimesController";
import { MainTollController } from "../services/toll/MainTollController";
import { MainWaecController } from "../services/waec/MainWaecControllet";
import { logger } from "../utils/logger";

export async function mainApiController(req: Request, res: Response) {
    const { serviceCode } = req.body;

    try {
        if (!serviceCode) return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "service code is required" });
        logger.info(serviceCode);
        if (!req.user) return { message: "no user" };
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
                if (req.body.type === "SMILE") {
                    const validateSmileBundle = new MainSmileBundleController(req, req.user);
                    const validateSmileBundleFunc = await validateSmileBundle.validate();
                    return res.status(validateSmileBundleFunc.status ? Number(validateSmileBundleFunc.status) : 200).json({ ...validateSmileBundleFunc });
                } else {
                    const validateSpectranetPin = new MainSpectranetController(req, req.user);
                    const validateSpectranetPinFunc = await validateSpectranetPin.validate();
                    return res.status(validateSpectranetPinFunc.status ? Number(validateSpectranetPinFunc.status) : 200).json({ ...validateSpectranetPinFunc });
                }
            case "P-Internet":
                if (req.body.type === "SMILE") {
                    const paymentSmileBundle = new MainSmileBundleController(req, req.user);
                    const paymentSmileBundleFunc = await paymentSmileBundle.purchase();
                    return res.status(paymentSmileBundleFunc.status ? Number(paymentSmileBundleFunc.status) : 200).json({ ...paymentSmileBundleFunc });
                } else {
                    const paymentSpectranetPin = new MainSpectranetController(req, req.user);
                    const paymentSpectranetPinFunc = await paymentSpectranetPin.purchase();
                    return res.status(paymentSpectranetPinFunc.status ? Number(paymentSpectranetPinFunc.status) : 200).json({ ...paymentSpectranetPinFunc });
                }
            case "SHVAL":
                const validateShowMax = new MainShowMaxController(req, req.user);
                const validateShowMaxFunc = await validateShowMax.validate();
                return res.status(validateShowMaxFunc.status ? Number(validateShowMaxFunc.status) : 200).json({ ...validateShowMaxFunc });
            case "SHPAY":
                const showmaxPayment = new MainShowMaxController(req, req.user);
                const showmaxPaymentFunc = await showmaxPayment.purchase();
                return res.status(showmaxPaymentFunc?.status ? Number(showmaxPaymentFunc.status) : 200).json({ ...showmaxPaymentFunc });
            case "NVAL":
                const validateNtel = new MainNtelController(req, req.user);
                const validateNtelFunc = await validateNtel.validate();
                return res.status(validateNtelFunc.status ? Number(validateNtelFunc.status) : 200).json({ ...validateNtelFunc });
            case "NTOP":
                const rechargeNtel = new MainNtelController(req, req.user);
                const rechargeNtelFunc = await rechargeNtel.recharge();
                return res.status(rechargeNtelFunc.status ? Number(rechargeNtelFunc.status) : 200).json({ ...rechargeNtelFunc });
            case "NPAY":
                const TopUpNtel = new MainNtelController(req, req.user);
                const TopUpNtelFunc = await TopUpNtel.TopUp();
                return res.status(TopUpNtelFunc.status ? Number(TopUpNtelFunc.status) : 200).json({ ...TopUpNtelFunc });
            case "TVA":
                const validateToll = new MainTollController(req, req.user);
                const validateTollFunc = await validateToll.validate();
                return res.status(validateTollFunc.status ? Number(validateTollFunc.status) : 200).json({ ...validateTollFunc });
            case "V-TV":
                if (req.body.type === "DSTV") {
                    const validateDstv = new MainDstvController(req, req.user);
                    const validateDstvFunc = await validateDstv.validate();
                    return res.status(validateDstvFunc.status ? Number(validateDstvFunc.status) : 200).json({ ...validateDstvFunc });
                }
                if (req.body.type === "GOTV") {
                    const validateGotv = new MainGotvController(req, req.user);
                    const validateGotvFunc = await validateGotv.validate();
                    return res.status(validateGotvFunc.status ? Number(validateGotvFunc.status) : 200).json({ ...validateGotvFunc });
                }
                if (req.body.type === "STARTIMES") {
                    const validateStartimes = new MainStartimesController(req, req.user);
                    const validateStartimesFunc = await validateStartimes.validate();
                    return res.status(validateStartimesFunc.status ? Number(validateStartimesFunc.status) : 200).json({ ...validateStartimesFunc });
                }
            case "P-TV":
                if (req.body.type === "DSTV") {
                    const validateDstv = new MainDstvController(req, req.user);
                    const validateDstvFunc = await validateDstv.purchase();
                    return res.status(validateDstvFunc.status ? Number(validateDstvFunc.status) : 200).json({ ...validateDstvFunc });
                }
                if (req.body.type === "GOTV") {
                    const validateGotv = new MainGotvController(req, req.user);
                    const validateGotvFunc = await validateGotv.purchase();
                    return res.status(validateGotvFunc.status ? Number(validateGotvFunc.status) : 200).json({ ...validateGotvFunc });
                }
                if (req.body.type === "STARTIMES") {
                    const validateStartimes = new MainStartimesController(req, req.user);
                    const validateStartimesFunc = await validateStartimes.purchase();
                    return res.status(validateStartimesFunc.status ? Number(validateStartimesFunc.status) : 200).json({ ...validateStartimesFunc });
                }
            case "MULTICHOICE":
                const checkMultichoice = new MainDstvController(req, req.user);
                const checkMultichoiceFunc = await checkMultichoice.multichoice();
                return res.status(checkMultichoiceFunc.status ? Number(checkMultichoiceFunc.status) : 200).json({ ...checkMultichoiceFunc });
            case "MULTIPAY":
                const checkMultiPay = new MainDstvController(req, req.user);
                const checkMultiPayFunc = await checkMultiPay.multiPay();
                return res.status(checkMultiPayFunc.status ? Number(checkMultiPayFunc.status) : 200).json({ ...checkMultiPayFunc });
            case "INFO":
                const getUser = await getUserInfo(req.user);
                return res.status(getUser.status ? Number(getUser.status) : 200).json({ ...getUser });
            case "WAV":
                const validateWaec = new MainWaecController(req, req.user);
                const validateWaecFunc = await validateWaec.validate();
                return res.status(validateWaecFunc.status ? Number(validateWaecFunc.status) : 200).json({ ...validateWaecFunc });
            case "WAB":
                const paymentWaec = new MainWaecController(req, req.user);
                const paymentWaecFunc = await paymentWaec.purchase();
                return res.status(paymentWaecFunc.status ? Number(paymentWaecFunc.status) : 200).json({ ...paymentWaecFunc });
            case "V-BETADATA":
                const validateBetaData = new MainDataHubController(req, req.user);
                const validateBetaDataFunc = await validateBetaData.validate();
                return res.status(validateBetaDataFunc.status ? Number(validateBetaDataFunc.status) : 200).json({ ...validateBetaDataFunc });
            case "P-BETADATA":
                const paymentBetaData = new MainDataHubController(req, req.user);
                const paymentBetaDataFunc = await paymentBetaData.purchase();
                return res.status(paymentBetaDataFunc.status ? Number(paymentBetaDataFunc.status) : 200).json({ ...paymentBetaDataFunc });
            default:
                return res.status(400).json({ message: "invalid service code supplied" });
        }
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
}
