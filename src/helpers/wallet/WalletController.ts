import { PrismaClient } from "@prisma/client";

export class WalletController {
    public balance: number = 0;
    constructor(public userId: bigint, public amount: number, public reference: string, public source: string, public description: string) {
        this.amount = amount;
        this.userId = userId;
        this.description = description;
        this.reference = reference;
        this.source = source;
    }

    private prisma = new PrismaClient();

    async debit(): Promise<returnResponse> {
        if (this.amount <= 0) return { message: "failed" };
        const checkUser = await this.prisma.wallets.findUnique({ where: { user_id: this.userId } });
        if (!checkUser) return { message: "failed" };
        const deductBalance = await this.prisma.wallets.update({ where: { user_id: this.userId }, data: { balance: { decrement: this.amount } } });
        this.balance = deductBalance.balance;
        if (this.balance >= 0) {
            await this.prisma.wallet_histories.create({ data: { amount: this.amount, user_id: this.userId, description: this.description, reference: this.reference, balance_after: this.balance, source: this.source, type: "DEBIT" } });
            return { message: "success", data: this.amount };
        } else {
            await this.prisma.wallets.update({ where: { user_id: this.userId }, data: { balance: this.amount } });
            return { message: "failed" };
        }
    }
    async credit() {}
}
