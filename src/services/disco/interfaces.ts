interface successResponse {
    meterNo: string;
    accountNo?: null;
    customerName: string;
    customerAddress?: string;
    customerDistrict?: null;
    phoneNumber?: null;
    minimumAmount?: null;
    type: string;
    disco: string;
    status: string;
    message: string;
}

interface failedResponse {
    message: string;
    status: string;
}

interface successTokenResponse {
    token: string;
    configureToken: null;
    resetToken: null;
    unit: string;
    taxAmount: number;
    tokenAmount: null;
    bonusUnit: null;
    bonusToken: null;
    debtPayment: null;
    minimumAmount: null;
    arrear: null;
    arrearsApplied: null;
    amount: number;
    message: string;
    status: string;
    customerName: string;
    customerAddress: string;
    date: Date;
    transId: string;
    disco: string;
}
