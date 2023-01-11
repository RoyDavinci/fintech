import { Prisma, PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import HTTP_STATUS_CODE from "../constants/httpCodes";
import { logger } from "../utils/logger";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export const checkUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email = req.headers["email"];
        const password = req.headers["password"];
        if (typeof email === "undefined" || typeof password === "undefined" || typeof email === "object" || typeof password === "object") return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ message: "Authentication failed", status: 400 });
        if (typeof email === "string" && typeof password === "string") {
            const checkUser = await prisma.users.findUnique({ where: { email: email } });
            if (!checkUser) return res.status(400).json({ message: "Authentication failed wrong email", status: 400 });
            const checkPassword = await bcrypt.compare(password, checkUser.password);
            if (!checkPassword) return res.status(400).json({ message: "Authentication failed wrong password", status: 400 });
            req.user = checkUser;
            return next();
        }
    } catch (error) {
        logger.error(error);
        return res.status(HTTP_STATUS_CODE.BAD_REQUEST).json({ error });
    }
};
