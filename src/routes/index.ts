import { Router } from "express";
import userRouter from "./userRouter";
import raidRecordRouter from "./raidRecordRouter";

const router = Router();

router.use("/user", userRouter);

router.use("/bossRaid", raidRecordRouter);

export default router;
