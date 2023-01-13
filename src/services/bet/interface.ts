interface validateResponse {
    message: string;
    status: string;
}

interface validateSuccessResponse {
    status: string;
    message: string;
    name: string;
    type: string;
    customerId: string;
    reference: string;
    accountNumber: null;
    phoneNumber: null;
    emailAddress: null;
    canVend: true;
    minPayableAmount: number;
    charge: number;
}
interface paymentSuccessfulResponse {
    status: string;
    message: string;
    name: string;
    customerId: string;
    amount: string;
    transId: string;
    date: Date;
    type: string;
}
