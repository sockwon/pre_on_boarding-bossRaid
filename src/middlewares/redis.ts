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

const isExist = async () => {
  const redisCli = await redisConnect();

  const exist = await redisCli.exists("ranking");
  await redisCli.quit();
  return exist;
};

const getRankingDataFromRedis = async () => {
  const redisCli = await redisConnect();

  const data = await redisCli.get("ranking");
  await redisCli.quit();
  return data;
};

const processData = async (userId: number, data: any) => {
  const jsonData = JSON.parse(data);

  const result = await rankDataProcess(userId, jsonData);
  return result;
};

const checkCache = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.body;
  const exist = await isExist();

  if (exist) {
    const result = await getRankingDataFromRedis();
    const processedResult = await processData(userId, result);
    res.status(200).json(processedResult);
  } else {
    next();
  }
};

export {
  redisConnect,
  checkCache,
  isExist,
  getRankingDataFromRedis,
  processData,
};
