interface showMaxValidate {
    message: string;
    status: string;
    product: [
        {
            name: string;
            subscriptionPeriod: number;
            price: number;
            type: string;
        },
    ];
}

interface showMaxPaymentResponse {
    amount: string;
    message: string;
    status: string;
    transId: string;
    date: string;
    package: string;
    subscriptionPeriod: string;
    subscriptionType: string;
    validUntil: Date;
    voucherCode: string;
    captureUrl: string;
}
