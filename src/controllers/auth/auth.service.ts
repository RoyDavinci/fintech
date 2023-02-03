import { Router } from "express";
import { checkUser } from "../../common/middlewares";
import { nextFunction, createAccount, getUsers, login } from "./auth.controllers";
import { validateUserCreateInput } from "./auth.middlewares";

const authRouter = Router();

authRouter.post("/create/account", validateUserCreateInput, createAccount);
authRouter.post("/login", login);
authRouter.get("/users", getUsers);
authRouter.get("/headers", checkUser, nextFunction);

export { authRouter };
