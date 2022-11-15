import { Router } from "express";
import userController from "../controllers/userController";
import errorHandlerAsync from "../middlewares/errorHandler";
import { checkCache } from "../middlewares/redis";

const router = Router();

router.post("/", errorHandlerAsync(userController.userCreateControll));

router.get(
  "/",
  errorHandlerAsync(checkCache),
  errorHandlerAsync(userController.getUserRankingControll)
);

router.get("/:userId", errorHandlerAsync(userController.getUserControll));

export default router;
