import { datah_bundles } from "@prisma/client";
import { Request, Response } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { prisma } from "../models/prisma";
import { logger } from "../utils/logger";

export const createData = async (req: Request, res: Response) => {
    const { data } = req.body;
    try {
        const items = await data.forEach(async (item: datah_bundles) => {
            await prisma.datah_bundles.create({
                data: { network: item.network, validity: item.validity, allowance: item.allowance, category: item.category, price: item.price, actual_amount: item.price, code: item.product_id ? item.product_id : "code" },
            });
        });
        return res.status(200).json({ items });
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
};
