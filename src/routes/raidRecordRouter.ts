import { Router } from "express";
import raidRecordController from "../controllers/raidRecordController";
import errorHandlerAsync from "../middlewares/errorHandler";

const router = Router();

router.get("/", errorHandlerAsync(raidRecordController.checkRecordControll));

router.post(
  "/enter",
  errorHandlerAsync(raidRecordController.startRaidControll)
);

export default router;
