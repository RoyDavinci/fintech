const serviceConfig = {
    shago: {
        testUrl: "http://test.shagopayments.com/public/api/test/b2b",
        liveUrl: "",
        key: process.env.HASHKEY,
    },
    showmax: {
        username: "test",
        password: "NeRWNtWQMS",
        lookup: "https://mcapi-demo.herokuapp.com/Vendor/Lookup",
        vend: "https://mcapi-demo.herokuapp.com/Vendor/SinglePayment",
    },
    ringo: {
        url: "https://www.api.ringo.ng/api/agent/p2",
        email: process.env.RINGO_EMAIL,
        password: process.env.RINGO_PASSWORD,
        addonUrl: "https://www.api.ringo.ng/api/dstv/addon",
    },
    datahub: {
        testPublicKey: process.env.DATAHUB_TEST_PUBLIC_KEY,
        testPrivateKey: process.env.DATAHUB_TEST_PRIVATE_KEY,
        merchantId: process.env.DATAHUB_MERCHANG_ID,
        allowedIp: process.env.DATAHUB_ALLOWED_IP,
        url: "https://api.rechargehub.ng/v1/vendData",
        encodesString: process.env.DATAHUB_ENCODED_STRING,
    },
};
export default serviceConfig;
