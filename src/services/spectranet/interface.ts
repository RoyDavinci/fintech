interface validateSpectranetResponse {
    message: string;
    status: string;
    product: [
        {
            availability: null;
            price: number;
            name: null;
            allowance: null;
            validity: null;
            code: null;
        },
    ];
}

interface paymentSpectranetResponse {
    amount: number;
    message: string;
    status: string;
    transId: string;
    date: string;
    pin: [
        {
            pin: string;
            serial: string;
            expirydat: string;
        },
    ];
    transactionRef: string;
}
