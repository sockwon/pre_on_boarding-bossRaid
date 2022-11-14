import database from "./database";
import RaidRecord from "../entity/RaidRecord";
import { IRaidRecordInput } from "../interfaces/IRaidRecord";

const startCondition1 = async () => {
  return await database
    .getRepository(RaidRecord)
    .createQueryBuilder("raidRecord")
    .getCount();
};

const startCondition2 = async () => {
  return await database
    .getRepository(RaidRecord)
    .createQueryBuilder("raidRecord")
    .orderBy("raidRecord.id", "DESC")
    .limit(1)
    .getOne();
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

  if (condition1 === 0 || condition2?.endTime !== null) {
    const result = await database
      .createQueryBuilder()
      .insert()
      .into(RaidRecord)
      .values(data)
      .execute();
    const raidRecordId = result.identifiers[0].id;
    return { isEntered: true, raidRecordId };
  } else {
    return { isEntered: false, raidRecordId: null };
  }
};

export default { checkRecordDao, startRaidDao };
