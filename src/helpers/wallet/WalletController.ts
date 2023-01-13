import { prisma } from "../../models/prisma";
import { logger } from "../../utils/logger";

export class WalletController {
    constructor(public userId: number, public amount: number, public reference: string, public source: string, public description: string) {
        this.amount = amount;
        this.userId = userId;
        this.description = description;
        this.reference = reference;
        this.source = source;
    }

    public remainingBalance: number = 0;
    public balance: number = 0;

    async debit(): Promise<returnResponse> {
        logger.info("gotten to debitting user");
        if (this.amount <= 0) return { message: "failed" };
        const checkUser = await prisma.wallets.findUnique({ where: { user_id: this.userId } });
        if (!checkUser) return { message: "failed" };
        const deductBalance = await prisma.wallets.update({ where: { user_id: this.userId }, data: { balance: { decrement: this.amount } } });
        this.balance = deductBalance.balance;
        if (this.balance >= 0) {
            await prisma.wallet_histories.create({ data: { amount: this.amount, user_id: this.userId, description: this.description, reference: this.reference, balance_after: this.balance, source: this.source, type: "DEBIT" } });
            return { message: "success", data: this.amount };
        } else {
            await prisma.wallets.update({ where: { user_id: this.userId }, data: { balance: this.amount } });
            return { message: "failed" };
        }
    }
    async credit(): Promise<returnResponse> {
        logger.info("gotten to creditting user");
        if (this.description.includes("REVERSAL")) {
            this.source = "System_Reversal";
        }
        if (this.amount <= 0) return { message: "failed" };
        const checkDetails = prisma.wallets.findFirst({ where: { user_id: this.userId } });
        if (!checkDetails) return { message: "failed" };
        const wallet = await prisma.wallets.update({ where: { user_id: this.userId }, data: { balance: { increment: this.amount } } });
        // this.balance = wallet.balance + this.amount;
        await prisma.wallet_histories.create({
            data: {
                amount: this.amount,
                user_id: this.userId,
                description: this.description,
                reference: this.reference,
                balance_after: wallet.balance,
                source: this.source,
                type: "CREDIT",
            },
        });
        return { message: "success", data: this.amount };
    }

    async commission(): Promise<returnResponse> {
        logger.debug(`${this.userId} ${this.description} ${this.reference} ${this.source} ${this.amount}`);
        if (this.amount <= 0) return { message: "failed" };
        const checkDetails = prisma.wallets.findFirst({ where: { user_id: this.userId } });
        if (!checkDetails) return { message: "failed" };
        const wallet = await prisma.wallets.update({ where: { user_id: this.userId }, data: { commission_balance: { increment: this.amount } } });
        this.balance = wallet.balance + this.amount;
        await prisma.wallet_histories.create({
            data: {
                amount: this.amount,
                user_id: this.userId,
                description: this.description,
                reference: this.reference,
                balance_after: this.balance,
                source: this.source,
                type: "CREDIT",
            },
        });
        return { message: "success", data: this.amount };
    }
}
