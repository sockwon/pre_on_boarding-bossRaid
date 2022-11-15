import raidRecordDao from "../models/raidRecordDao";
import {
  IRaidRecordInput,
  Value,
  IRaidEndInput,
} from "../interfaces/IRaidRecord";
import Joi from "joi";
import axios from "axios";
import { redisConnect } from "../middlewares/redis";

const timeLimit = async (limit: number) => {
  const start: any = new Date();
  setTimeout(async () => {
    try {
      await raidRecordDao.closeRaidDao();
      const end: any = new Date();
      console.log((end - start) / 1000);
    } catch (err) {
      console.log(err);
    }
  }, limit * 1000);
};

const schemaStartRaid = Joi.object({
  userId: Joi.number().required(),
  level: Joi.number().required(),
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

const startRaid = async (data: IRaidRecordInput) => {
  await schemaStartRaid.validateAsync(data);

  const temp = await bossRaidData();
  const limit = await temp.data.bossRaids[0].bossRaidLimitSeconds;
  await timeLimit(limit);

  const result = await raidRecordDao.startRaidDao(data);
  return result;
};

const scoresAccess = async () => {
  const redisCli = await redisConnect();
  const exist = await redisCli.exists("scores");

  if (exist) {
    const scores = await redisCli.get("scores");
    return JSON.parse(scores);
  } else {
    const axiosData = await bossRaidData();
    await redisCli.set("scores", JSON.stringify(axiosData.data.bossRaids));
    await redisCli.expire("scores", 3600);
    return axiosData.data.bossRaids;
  }
};

const endRaid = async (data: IRaidEndInput) => {
  const scores = await scoresAccess();
  const level = await scores[0].levels;
  data.level = level;
  return await raidRecordDao.endRaidDao(data);
};

export default { checkRecord, startRaid, endRaid };
