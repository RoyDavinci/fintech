import { users } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { Request } from "express";
import { checkMobileNumber } from "../../common/checkNumber";
import { prisma } from "../../models/prisma";
import { v4 as uuid } from "uuid";
import { WalletController } from "../../helpers/wallet/WalletController";
import { logger } from "../../utils/logger";
import config from "../../config";
import axios from "axios";

interface productItem {
    price: Decimal;
    code: string;
    allowance: string;
    validity: string;
    category: string;
    network: string;
}

export class MainDataHubController {
    constructor(public body: Request, public user: users) {
        this.body = body;
        this.user = user;
    }

    public network = "";
    public phone = "";
    public errors: string[] = [];
    public product: productItem[] = [];
    public package = "";
    public bundle = "";
    public request_id = "";
    public networkName = "";
    public amount = "";

    async validate() {
        if (!this.body.body.phone) {
            this.errors.push("phone is required");
        } else {
            this.phone = this.body.body.phone;
        }
        if (!this.body.body.network) {
            this.errors.push("network is required");
        } else {
            this.network = this.body.body.network;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }
        if (this.network.toLowerCase() === "mtn") {
            const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: "MTN_BETA_DATA" } });
            if (!checkProductCategory || checkProductCategory.status === "1") {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const checkSwitcher = await prisma.switchers.findUnique({ where: { name: "MTN_BETA_DATA" } });
            if (!checkSwitcher) {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const getBetaData = await prisma.datah_bundles.findMany({ where: { network: "MTN" } });
            for (let index = 0; index < getBetaData.length; index++) {
                this.product.push({
                    allowance: getBetaData[index].allowance,
                    code: getBetaData[index].code,
                    price: getBetaData[index].price,
                    validity: getBetaData[index].validity,
                    category: getBetaData[index].category,
                    network: getBetaData[index].network,
                });
            }
            return { message: "successful", status: "200", product: this.product, network: this.network, phobe: this.phone };
        }
        if (this.network.toLowerCase() === "airtel") {
            const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: "AIRTEL_BETA_DATA" } });
            if (!checkProductCategory || checkProductCategory.status === "1") {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const checkSwitcher = await prisma.switchers.findUnique({ where: { name: "AIRTEL_BETA_DATA" } });
            if (!checkSwitcher) {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const getBetaData = await prisma.datah_bundles.findMany({ where: { OR: [{ network: "AIRTEL" }, { network: "Airtel" }] } });
            for (let index = 0; index < getBetaData.length; index++) {
                this.product.push({
                    allowance: getBetaData[index].allowance,
                    code: getBetaData[index].code,
                    price: getBetaData[index].price,
                    validity: getBetaData[index].validity,
                    category: getBetaData[index].category,
                    network: getBetaData[index].network,
                });
            }
            return { message: "successful", status: "200", product: this.product, network: this.network, phobe: this.phone };
        }
        if (this.network.toLowerCase() === "9mobile" || this.network.toLowerCase() === "etisalat") {
            const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: "9MOBILE_BETA_DATA" } });
            if (!checkProductCategory || checkProductCategory.status === "1") {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const checkSwitcher = await prisma.switchers.findUnique({ where: { name: "9MOBILE_BETA_DATA" } });
            if (!checkSwitcher) {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const getBetaData = await prisma.datah_bundles.findMany({ where: { network: "9MOBILE" } });
            for (let index = 0; index < getBetaData.length; index++) {
                this.product.push({
                    allowance: getBetaData[index].allowance,
                    code: getBetaData[index].code,
                    price: getBetaData[index].price,
                    validity: getBetaData[index].validity,
                    category: getBetaData[index].category,
                    network: getBetaData[index].network,
                });
            }
            return { message: "successful", status: "200", product: this.product, network: this.network, phobe: this.phone };
        }
        if (this.network.toLowerCase() === "glo") {
            const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: "GLO_BETA_DATA" } });
            if (!checkProductCategory || checkProductCategory.status === "1") {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const checkSwitcher = await prisma.switchers.findUnique({ where: { name: "GLO_BETA_DATA" } });
            if (!checkSwitcher) {
                return { message: "product not available for purchase yet", status: "301" };
            }
            const getBetaData = await prisma.datah_bundles.findMany({ where: { network: "GLO" } });
            for (let index = 0; index < getBetaData.length; index++) {
                this.product.push({
                    allowance: getBetaData[index].allowance,
                    code: getBetaData[index].code,
                    price: getBetaData[index].price,
                    validity: getBetaData[index].validity,
                    category: getBetaData[index].category,
                    network: getBetaData[index].network,
                });
            }
            return { message: "successful", status: "200", product: this.product, network: this.network, phobe: this.phone };
        }
        return { message: `product network name ${this.network} does not exist`, status: "400" };
    }

    async purchase() {
        if (!this.body.body.bundle) {
            this.errors.push("bundle is required");
        } else {
            this.bundle = this.body.body.bundle;
        }
        if (!this.body.body.network) {
            this.errors.push("network is required");
        } else {
            this.network = this.body.body.network;
        }
        if (!this.body.body.package) {
            this.errors.push("package is required");
        } else {
            this.package = this.body.body.package;
        }
        if (!this.body.body.phone) {
            this.errors.push("phone is required");
        } else {
            this.phone = this.body.body.phone;
        }
        if (!this.body.body.amount) {
            this.errors.push("amount is required");
        } else {
            this.amount = this.body.body.amount;
        }
        if (!this.body.body.request_id) {
            this.errors.push("request_id is required");
        } else {
            this.request_id = this.body.body.request_id;
        }
        if (this.errors.length >= 1) {
            return { message: "failed", error: this.errors, status: "300" };
        }

        const checkDataHub = await prisma.data_requests.findUnique({ where: { request_id: this.request_id } });
        if (checkDataHub) return { message: "Duplicate request ID", status: "301" };

        const validatePhone = checkMobileNumber(this.phone);

        if (this.network.toLowerCase() === "9mobile" || this.network.toLowerCase() === "etisalat") {
            this.networkName = "ETISALAT";
        }
        this.networkName = this.network.toUpperCase();
        if (!validatePhone.correct) {
            return { message: "Invalid phone number provided", status: "300" };
        }
        const checkProductCategory = await prisma.product_categories.findFirst({ where: { name: `${this.networkName}_BETA_DATA` } });
        if (!checkProductCategory || checkProductCategory.status === "1") {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const checkSwitcher = await prisma.switchers.findUnique({ where: { name: `${this.networkName}_BETA_DATA` } });
        if (!checkSwitcher) {
            return { message: "product not available for purchase yet", status: "301" };
        }
        const createNewDatahunRequest = await prisma.data_requests.create({
            data: {
                request_id: this.request_id,
                user_id: this.user.id,
                network: this.network,
                trans_code: uuid().slice(0, 10),
                phone_number: this.phone,
                biller_id: checkSwitcher.biller_id,
                category_id: checkSwitcher.category_id,
                amount: Number(this.amount),
                package: "DATAHUB",
            },
        });

        const wallet = new WalletController(this.user.id, Number(this.amount), "BETADATA", createNewDatahunRequest.trans_code, "Ntel Recharge Purchase");
        const debited = await wallet.debit();
        logger.info(debited);
        if (debited.message === "success" && debited.data === Number(this.amount)) {
            logger.info("yes it is correct");
            return await this.giveValue(createNewDatahunRequest.trans_code, "WALLET");
        } else {
            return { message: "insufficient balance to comeplete transaction", status: "300", amount: this.amount };
        }
    }

    async giveValue(trans_code: string, reference: string) {
        const checkDataHub = await prisma.data_requests.findUnique({ where: { trans_code } });
        if (!checkDataHub) return { message: "failed", status: "300" };
        await prisma.transactions.create({
            data: {
                reference: checkDataHub.request_id,
                amount: Number(this.amount),
                source: "DATAHUB",
                status: "ZERO",
                channel: "B2B",
                request_id: trans_code,
                payment_method: reference,
                description: "BETADATA Purchase",
                destination: checkDataHub.bundle,
                user_id: checkDataHub.user_id,
                product_category_id: checkDataHub.category_id,
                payment_status: "ZERO",
            },
        });
        const string = `${config.datahub.testPublicKey}|${config.datahub.merchantId}|${this.phone}${config.datahub.testPrivateKey}`;
        const checkSum = Buffer.from(string).toString("base64");
        logger.info(checkSum);
        const { data } = await axios.post(config.datahub.url, { merchantId: config.datahub.merchantId, networkId: this.network, plan: this.bundle, recipient: this.phone, checksum: checkSum });
        console.log(data);
        return { data, message: "", status: "200" };
    }
}
