import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 1000, // per seconds
    max: 30, // Limit each IP to 100 requests per `window` (here, per second)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
