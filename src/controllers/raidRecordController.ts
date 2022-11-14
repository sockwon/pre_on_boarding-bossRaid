import raidRecordService from "../services/raidRecordService";
import { Request, Response } from "express";

const getRaidRecordControll = async (req: Request, res: Response) => {
  const result = await raidRecordService.getRaidRecord();
  res.status(200).json(result);
};

export default { getRaidRecordControll };
