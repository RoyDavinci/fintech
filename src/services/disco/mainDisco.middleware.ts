import { NextFunction, Request } from "express";
import { check, body, param, validationResult } from "express-validator";
import { validationErrorHandler } from "../../utils/validationErrorHandler";

export const validatingDiscoInput = [
    check("disco").notEmpty().withMessage("disco is compulsory").isString().withMessage("disco must be string"),
    check("type").notEmpty().withMessage("type is required").isString().withMessage("type must be string"),
    check("meterNo").notEmpty().withMessage("meter number is required").isString().withMessage("meter number must be string"),
    validationErrorHandler,
];

export const post_credit_check = (req: Request) => {
    Object.keys(req.body).map((item) => {
        check(item);
    });
};
