import { Router } from "express";
import { checkHealth } from "./health";

const healthRouter = Router();

healthRouter.get("/health", checkHealth);

export default healthRouter;
