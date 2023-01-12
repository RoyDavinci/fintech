import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import { logger } from "../../utils/logger";
import HTTP_STATUS_CODE from "../../constants/httpCodes";
import bcrypt from "bcryptjs";
import { checkMobileNumber } from "../../common/checkNumber";
import { generateWalletId } from "../../common/generateRandomId";
import { prisma } from "../../models/prisma";

export const createAccount = async (req: Request, res: Response) => {
    const { name, email, phone_number, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const createNewUser = await prisma.users.create({ data: { name, email, phone_number, password: hashedPassword, status: "ONE" } });

        try {
            Promise.all([
                await prisma.wallets.create({ data: { code: generateWalletId().toString(), user_id: createNewUser.id, balance: generateWalletId(), bonus_balance: 0.0, commission_balance: 0.0 } }),
                await prisma.agent_infos.create({ data: { user_id: createNewUser.id, status: "ONE" } }),
            ]);
        } catch (error) {
            logger.error(error);
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
        }
        return res.status(200).json({ message: "user created", user: { id: createNewUser.id, name: createNewUser.name, email: createNewUser.email, phone_number: createNewUser.phone_number } });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                logger.info("There is a unique constraint violation, a new user cannot be created with this email", e);
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "There is a unique constraint violation, a new user cannot be created with this email" });
            }
            logger.info(e);
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: e });
        }
        logger.info(e);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: e, message: "an error occured on creating a user" });
    }
};

export const getUsers = async (req: Request, res: Response) => {
    try {
        const users = await prisma.users.findMany({});
        return res.status(200).json({ message: "users gotten", users });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError) {
            // The .code property can be accessed in a type-safe manner
            if (e.code === "P2002") {
                logger.info(e.message);
                return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: e.message });
            }
            logger.info(e);
            return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: e });
        }
        logger.info(e);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error: e, message: "getting users failed" });
    }
};

export const nextFunction = async (req: Request, res: Response) => {
    const { phone } = req.body;

    try {
        const check = checkMobileNumber(phone);
        const wallet = generateWalletId();
        if (!check.correct) return res.status(400).json({ message: "invalid nigerian number", status: check.status, wallet });
        return res.status(200).json({ message: "gotten here", check, wallet });
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
};
