interface ntelValidate {
    message: string;
    status: string;
    product: [
        {
            code: string;
            price: string;
            description: string;
        },
    ];
    phone: string | null;
    type: string;
}

interface ntelTopUpResponse {
    message: string;
    status: string;
    amount: string;
    transId: string;
    type: string;
    date: string;
    phone: string;
}
interface ntelBundleResponse extends ntelTopUpResponse {
    package: "Free onnet & 50 offnet minutes, 25 SMS; valid for 14days";
}
