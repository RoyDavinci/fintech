import { Router } from "express";
import { checkUser } from "../common/middlewares";
import { authRouter } from "../controllers";
import { createData, createDataHub } from "../controllers/addData";
import healthRouter from "../controllers/health/health.service";
import { mainApiController } from "../controllers/MainController";

const apiV1Router = Router();

apiV1Router.use("/", healthRouter);
apiV1Router.use("/auth", authRouter);
apiV1Router.post("/start", checkUser, mainApiController);
apiV1Router.post("/datah", createData);

export default apiV1Router;
