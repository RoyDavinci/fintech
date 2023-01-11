import joi from "joi";
import dotenv from "dotenv-safe";

dotenv.config();
const envSchema = joi.object({
    NODE_ENV: joi.string().allow("development", "production", "test"),
    PORT: joi.string().required(),
    API_VERSION: joi.string(),
    SECRET: joi.string().required(),
});

const { error, value: envVars } = envSchema.validate(process.env);
// if (error) {
//     throw new Error(`Config validation error: ${error.message}`);
// }

const config = {
    // environment: envVars.NODE_ENV,
    // isTest: envVars.NODE_ENV === "test",
    isDevelopment: envVars.NODE_ENV === "development",
    // server: {
    //     port: envVars.PORT || "8080",
    //     apiVersion: envVars.API_VERSION || "v1",
    //     secret: envVars.SECRET,
    // },
};

export default config;
