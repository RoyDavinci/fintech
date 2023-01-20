interface tvValidateResponse {
    message: string;
    status: string | number;
    product?: [
        {
            name: string;
            code: string;
            month: number;
            price: number;
            period: number;
        },
    ];
    type?: string;
    smartCardNo?: string;
    error?: string[];
}

interface tvPaymentResponse {
    message: string;
    status: string | number;
    transId: string;
    date: string;
    type: string;
    package: string;
    amount: number;
}
