import userService from "../services/userService";
import { Request, Response } from "express";

const userCreateControll = async (req: Request, res: Response) => {
  const result = await userService.createUser();
  const userId = result["generatedMaps"][0]["id"];
  res.status(201).json({ userId });
};

const getUserControll = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const result = await userService.getUser(Number(userId));
  res.status(200).json(result);
};

const getUserRankingControll = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const result = await userService.getUserRanking(userId);
  res.status(201).json(result);
};

export default { userCreateControll, getUserControll, getUserRankingControll };
