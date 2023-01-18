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
};
export default serviceConfig;
