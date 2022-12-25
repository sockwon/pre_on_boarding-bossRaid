import raidRecordDao from "../models/raidRecordDao";
import {
  IRaidRecordInput,
  Value,
  IRaidEndInput,
} from "../interfaces/IRaidRecord";
import Joi from "joi";
import axios from "axios";
import { redisConnect } from "../middlewares/redis";
import { erorrGenerator } from "../middlewares/errorGenerator";

const timeLimit = async (limit: number) => {
  setTimeout(async () => {
    try {
      await raidRecordDao.closeRaidDao();
    } catch (err) {
      console.log(err);
    }
  }, limit * 1000);
};

const schemaStartRaid = Joi.object({
  userId: Joi.number().required(),
  level: Joi.number().integer().min(1).max(3).required(),
});

const checkRecord = async () => {
  const result = await raidRecordDao.checkRecordDao();
  const value: Value = {
    canEnter: true,
    enteredUserId: null,
  };
  if (result["condition1"] === 0) {
    return value;
  }

  if (result["condition2"][0]?.endTime === null) {
    value.canEnter = false;
    value.enteredUserId = await result.condition2[0].userId;
    return value;
  } else {
    return value;
  }
};

const bossRaidData = async () => {
  return await axios({
    method: "get",
    url: "https://dmpilf5svl7rv.cloudfront.net/assignment/backend/bossRaidData.json",
  });
};

const scoresAccess = async () => {
  const redisCli = await redisConnect();
  const exist = await redisCli.exists("scores");

  if (exist) {
    const scores = await redisCli.get("scores");
    await redisCli.quit();
    return JSON.parse(scores);
  } else {
    const axiosData = await bossRaidData();
    await redisCli.set("scores", JSON.stringify(axiosData.data.bossRaids));
    await redisCli.expire("scores", 3600);
    await redisCli.quit();
    return axiosData.data.bossRaids;
  }
};

const startRaid = async (data: IRaidRecordInput) => {
  await schemaStartRaid.validateAsync(data);

  const temp = await scoresAccess();
  const limit = await temp[0].bossRaidLimitSeconds;
  await timeLimit(limit);

  const result = await raidRecordDao.startRaidDao(data);
  return result;
};

const endRaid = async (data: IRaidEndInput) => {
  const scores = await scoresAccess();
  const level = await scores[0].levels;
  data.level = level;
  return await raidRecordDao.endRaidDao(data);
};

export default { checkRecord, startRaid, endRaid };
