import { users } from "@prisma/client";
import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";

export async function getUserInfo(user: users) {
    try {
        const findUser = await prisma.users.findUnique({ where: { id: user.id } });
        if (!findUser) return { message: "failed", status: "300" };
        const getBalance = await prisma.wallets.findUnique({ where: { user_id: findUser.id } });
        if (!getBalance) return { message: "failed", status: "300" };
        return { balance: getBalance.balance, commission_balance: getBalance.commission_balance, wallet: findUser.email };
    } catch (error) {
        logger.info(error);
        return { message: error, status: "400" };
    }
}
