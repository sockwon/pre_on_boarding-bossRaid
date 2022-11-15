import { Router } from "express";
import userController from "../controllers/userController";
import errorHandlerAsync from "../middlewares/errorHandler";

const router = Router();

router.post("/", errorHandlerAsync(userController.userCreateControll));

router.get("/", errorHandlerAsync(userController.getUserRankingControll));

router.get("/:userId", errorHandlerAsync(userController.getUserControll));

export default router;
