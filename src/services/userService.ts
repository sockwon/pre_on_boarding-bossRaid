import userDao from "../models/userDao";
import { IRankingInfo } from "../interfaces/IUser";
import { rankDataProcess } from "../middlewares/processRankingData";
import { redisConnect } from "../middlewares/redis";
import Joi from "joi";
import cron from "node-cron";

const schemaGetUser = Joi.object({
  userId: Joi.number().required(),
});

const createUser = async () => {
  return await userDao.createUserDao();
};

const getUser = async (userId: number) => {
  await schemaGetUser.validateAsync({ userId });
  return await userDao.getUserDao(userId);
};

const getUserRanking = async (userId: number) => {
  await schemaGetUser.validateAsync({ userId });

  const ranking = await userDao.getTopRankerInfoListDao();

  const redisCli = await redisConnect();

  await redisCli.set("ranking", JSON.stringify(ranking));
  await redisCli.expire("ranking", 3600);

  return await rankDataProcess(userId, ranking);
};

cron.schedule("* */23 * * *", async () => {
  console.info("redis warmingup: getUserRanking");
  await getUserRanking(1);
});

export default { createUser, getUser, getUserRanking };
