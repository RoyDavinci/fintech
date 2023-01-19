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
        email: "georgeigwec@gmail.com",
        password: "1234567899",
        addonUrl: "https://www.api.ringo.ng/api/dstv/addon",
    },
};
export default serviceConfig;
