interface LccResponse {
    status: string;
    message: string;
    type: string;
    name: string;
    customerId: string;
    reference: string;
    accountNumber: string | null;
    phoneNumber: string | null;
    emailAddress: string | null;
    canVend: true;
    wallet: number;
}
