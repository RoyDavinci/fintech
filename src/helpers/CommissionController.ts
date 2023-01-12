import { prisma } from "../models/prisma";
import { logger } from "../utils/logger";
import { WalletController } from "./wallet/WalletController";

export class CommissionController {
    constructor(public reference: string, public type: string) {
        this.reference = reference;
        this.type = type;
    }

    public amount: number = 0;
    public actualAmount: number = 0;

    async disubrse() {
        let get;
        let transactions;
        switch (this.type) {
            case "DISCO":
                get = await prisma.disco_requests.findUnique({ where: { request_id: this.reference } });
                transactions = await prisma.transactions.findUnique({ where: { reference: this.reference } });
        }
        logger.info("insideComisionAirtime airtimerequestBelow");

        const productCheck = await prisma.products.findFirst({ where: { biller_id: get?.biller_id, category_id: get?.category_id } });
        if (!get && !transactions) return { message: "commission disbursement failed", status: "400" };
        if (productCheck && productCheck.commission_type === "percentage") {
            const vetCommission = await prisma.commission_details.findFirst({ where: { user_id: get?.id, category_id: get?.category_id } });
            if (vetCommission) {
                if (this.type === "EPINS") {
                    const findValue = await prisma.pin_requests.findFirst({ where: { batch_id: this.reference } });
                    if (findValue) {
                        this.amount = (findValue.amount * findValue.quantity * Number(vetCommission.value)) / 100;
                    }
                } else {
                    if (get?.amount) {
                        this.amount = (get.amount * Number(vetCommission.value)) / 100;
                    }
                }
            } else {
                if (this.type === "EPINS") {
                    const findValue = await prisma.pin_requests.findFirst({ where: { batch_id: this.reference } });
                    if (findValue) {
                        this.amount = (findValue.amount * findValue.quantity * Number(productCheck.agent_value)) / 100;
                    }
                } else {
                    if (get?.amount) {
                        this.amount = (get.amount * Number(productCheck.agent_value)) / 100;
                    }
                }
            }
        } else {
            const vetCommission = await prisma.commission_details.findFirst({ where: { user_id: get?.id, category_id: get?.category_id } });
            if (vetCommission) {
                this.amount = Number(vetCommission.value);
            } else {
                this.amount = Number(productCheck?.agent_value);
            }
        }

        const user = await prisma.agent_infos.findFirst({ where: { user_id: get?.user_id, status: "ONE" } });
        if (get?.amount) {
            if (user) {
                if (this.type === "EPINS") {
                    const findValue = await prisma.pin_requests.findFirst({ where: { batch_id: this.reference } });
                    if (findValue) {
                        this.actualAmount = findValue?.amount * findValue.quantity - this.amount;
                    }

                    await prisma.transactions.update({ where: { reference: this.reference }, data: { balance_after: this.actualAmount } });
                    const wallet = new WalletController(user.user_id, this.amount, `${this.type}_COMMISSION`, this.reference, "COMMISSION");
                    await wallet.credit();
                }
                this.actualAmount = get?.amount - this.amount;
                await prisma.transactions.update({ where: { reference: this.reference }, data: { balance_after: this.actualAmount } });
                const wallet = new WalletController(user.user_id, this.amount, `${this.type}_COMMISSION`, this.reference, "COMMISSION");
                await wallet.credit();
            } else {
                if (this.type === "EPINS") {
                    const findValue = await prisma.pin_requests.findFirst({ where: { batch_id: this.reference } });
                    if (findValue) {
                        this.actualAmount = findValue?.amount * findValue.quantity - this.amount;
                    }

                    await prisma.transactions.update({ where: { reference: this.reference }, data: { balance_after: this.actualAmount } });
                }
                this.actualAmount = get?.amount - this.amount;
                await prisma.transactions.update({ where: { reference: this.reference }, data: { balance_after: this.actualAmount } });
            }
        }
    }
}
