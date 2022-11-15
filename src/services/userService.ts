import userDao from "../models/userDao";
import { IRankingInfo } from "../interfaces/IUser";
import { rankDataProcess } from "../middlewares/processRankingData";
import Joi from "joi";

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

  return await rankDataProcess(userId, ranking);
};

export default { createUser, getUser, getUserRanking };
