import database from "./database";
import RaidRecord from "../entity/RaidRecord";
import User from "../entity/User";
import {
  IRaidRecordInput,
  IRaidEndInput,
  IScores,
} from "../interfaces/IRaidRecord";
import { erorrGenerator } from "../middlewares/errorGenerator";

const startCondition1 = async () => {
  return await database
    .getRepository(RaidRecord)
    .createQueryBuilder("raidRecord")
    .getCount();
};

const startCondition2 = async () => {
  return await database.query(
    `SELECT * FROM raid_record ORDER BY raid_record.id DESC LIMIT 1`
  );
};

const checkRecordDao = async () => {
  const condition1 = await startCondition1();

  if (condition1 === 0) {
    return { condition1 };
  }

  const condition2 = await startCondition2();
  return { condition2 };
};

const startRaidDao = async (data: IRaidRecordInput) => {
  const condition1 = await startCondition1();

  let condition2;

  if (condition1 !== 0) {
    condition2 = await startCondition2();
  }

  if (condition1 === 0 || condition2[0]?.endTime !== null) {
    const result = await database
      .createQueryBuilder()
      .insert()
      .into(RaidRecord)
      .values({ level: data.level, user: data.userId })
      .execute();
    const raidRecordId = result.identifiers[0].id;
    return { isEntered: true, raidRecordId };
  } else {
    return { isEntered: false, raidRecordId: null };
  }
};

const getRaidRecord = async (data: IRaidEndInput) => {
  const id = data.raidRecordId;

  return await database
    .getRepository(RaidRecord)
    .createQueryBuilder()
    .where("id=:id", { id: id })
    .execute();
};

const userUpdateScore = async (data: IRaidEndInput, value: number) => {
  await database
    .createQueryBuilder()
    .update(User)
    .set({ totalScore: () => `totalScore+${value}` })
    .where("id = :id", { id: data.userId })
    .execute();
};

const endRaidDao = async (data: IRaidEndInput) => {
  const raidRecord = await getRaidRecord(data);

  if (raidRecord[0].RaidRecord_isClear === true) {
    erorrGenerator(403);
  }

  if (raidRecord[0].RaidRecord_endTime !== null) {
    erorrGenerator(403);
  }

  if (raidRecord[0].RaidRecord_userId !== data.userId) {
    erorrGenerator(403);
  }

  const userLevel: number = raidRecord[0].RaidRecord_level;
  const score = data.level[userLevel - 1]["score"];

  const result = await database
    .createQueryBuilder()
    .update(RaidRecord)
    .set({ isClear: true, score: score })
    .where("id = :id", { id: data.raidRecordId })
    .execute();

  await userUpdateScore(data, score);
  return result;
};

const closeRaidDao = async () => {
  const lastRecord = await startCondition2();
  const recordId = lastRecord[0].id;

  if (lastRecord[0].endTime !== null) {
    return;
  }

  await database
    .createQueryBuilder()
    .update(RaidRecord)
    .set({ endTime: () => `NOW()` })
    .where("id = :id", { id: recordId })
    .execute();
  erorrGenerator(403, "timeout");
};

export default { checkRecordDao, startRaidDao, endRaidDao, closeRaidDao };
