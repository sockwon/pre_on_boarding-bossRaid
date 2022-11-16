import * as redis from "redis";
import { rankDataProcess } from "./processRankingData";
import { Request, Response, NextFunction } from "express";

const redisConnect = async () => {
  const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  redisClient.on("connect", () => {
    console.info("Redis Connected");
  });
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  await redisClient.connect().then();
  return redisClient.v4;
};

const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const redisCli = await redisConnect();
  const exist = await redisCli.exists("ranking");

  if (exist) {
    const data = await redisCli.get("ranking");
    const result = await rankDataProcess(userId, JSON.parse(data));
    res.status(200).json(result);
  } else {
    next();
  }
};

export { redisConnect, checkCache };
