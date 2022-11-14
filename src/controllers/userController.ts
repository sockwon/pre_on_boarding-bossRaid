import userService from "../services/userService";
import { Request, Response } from "express";

const userCreateControll = async (req: Request, res: Response) => {
  const result = await userService.createUser();
  const userId = result["generatedMaps"][0]["id"];
  res.status(201).json({ userId });
};

export default { userCreateControll };
