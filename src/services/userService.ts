import userDao from "../models/userDao";
import { rankDataProcess } from "../middlewares/processRankingData";
import { redisConnect } from "../middlewares/redis";
import Joi from "joi";
import cron from "node-cron";
import { erorrGenerator } from "../middlewares/errorGenerator";
import { IRankingInfo } from "../interfaces/IUser";

/**
 * validation test 스키마
 */
const schemaGetUser = Joi.object({
  userId: Joi.number().required(),
});

/**
 * 사용자를 생성한다.
 * @returns
 */
const createUser = async () => {
  return await userDao.createUserDao();
};

/**
 * 존재하는 유저는 true을 반환한다. 없는 유저는 false을 반환한다.
 * @param userId
 * @returns true | false
 */
const checkUser = async (userId: number) => {
  const temp = await userDao.isUser(userId);
  const exist = Object.values(temp[0])[0] === "1" ? true : false;

  return exist;
};

/**
 * param 값이 false 일 경우 에러를 생성한다.
 * @param exist
 */
const checkForError = (exist: boolean) => {
  if (exist === false) {
    erorrGenerator(401, "not exist");
  }
};

/**
 * 사용자의 정보를 반환한다.
 * @param userId
 * @returns userInfo
 */
const getUser = async (userId: number) => {
  await schemaGetUser.validateAsync({ userId });

  const exist = await checkUser(userId);
  checkForError(exist);

  const userInfo = await userDao.getUserDao(userId);
  return userInfo;
};

/**
 * redis 서버에 랭킹 데이터를 업데이트 한다.
 * @param ranking
 */
const redisUpdateForRanking = async (ranking: IRankingInfo[]) => {
  const redisCli = await redisConnect();

  await redisCli.set("ranking", JSON.stringify(ranking));
  await redisCli.expire("ranking", 3600);
  await redisCli.quit();
};

/**
 * 랭킹 데이터를 반환한다. 반환하기 전에 레디스 업데이트 함수를 호출한다.
 * @param userId
 * @returns ranking
 */
const getUserRanking = async (userId: number) => {
  await schemaGetUser.validateAsync({ userId });

  const exist = await checkUser(userId);
  checkForError(exist);

  const rawRanking = await userDao.getTopRankerInfoListDao();

  await redisUpdateForRanking(rawRanking);

  const ranking = await rankDataProcess(userId, rawRanking);

  return ranking;
};

/**
 * 12시간 마다 랭킹 정보를 업데이트 한다.
 */
cron.schedule("0 0 */11 * * *", async () => {
  console.info("redis warmingup: getUserRanking");
  const rawRanking = await userDao.getTopRankerInfoListDao();
  await redisUpdateForRanking(rawRanking);
});

export default { createUser, getUser, getUserRanking };
