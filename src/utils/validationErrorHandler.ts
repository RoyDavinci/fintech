import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import statusCodes from "../constants/httpCodes";
import { validatorErrorFormater } from "./validationErrorFormater";

export const validationErrorHandler = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(statusCodes.BAD_REQUEST).json({
            success: false,
            message: "validation error",
            data: validatorErrorFormater(errors.array()),
        });

    return next();
};
