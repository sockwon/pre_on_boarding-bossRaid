import { Router } from "express";
import userController from "../controllers/userController";
import errorHandlerAsync from "../middlewares/errorHandler";

const router = Router();

router.post("/", errorHandlerAsync(userController.userCreateControll));

export default router;
