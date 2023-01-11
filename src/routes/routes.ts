import { Router } from "express";
import { checkUser } from "../common/middlewares";
import { authRouter } from "../controllers";
import healthRouter from "../controllers/health/health.service";
import { mainApiController } from "../controllers/MainController";

const apiV1Router = Router();

apiV1Router.use("/", healthRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.use("/start", checkUser, mainApiController);

export default apiV1Router;
