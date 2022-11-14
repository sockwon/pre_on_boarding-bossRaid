import raidRecordService from "../services/raidRecordService";
import { Request, Response } from "express";

const checkRecordControll = async (req: Request, res: Response) => {
  const result = await raidRecordService.checkRecord();
  res.status(200).json(result);
};

const startRaidControll = async (req: Request, res: Response) => {
  const data = req.body;
  const result = await raidRecordService.startRaid(data);
  res.status(201).json(result);
};

export default { checkRecordControll, startRaidControll };
