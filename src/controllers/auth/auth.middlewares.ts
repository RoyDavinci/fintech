import { check, body, param } from "express-validator";
import { validationErrorHandler } from "../../utils/validationErrorHandler";

export const validateUserCreateInput = [
    check("name").isString().withMessage("name must be string").optional({ checkFalsy: true }),
    check("email").notEmpty().withMessage("email is required").bail().isEmail().withMessage("invalid email format").isString().withMessage("email must be string"),
    check("password").notEmpty().withMessage("password is required").isString().withMessage("password must be string").isLength({ min: 5 }),
    check("phone_number").notEmpty().withMessage("phone_number is required").isString().withMessage("password must be string"),
    validationErrorHandler,
];
