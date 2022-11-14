import database from "./database";
import RaidRecord from "../entity/RaidRecord";

const getRecordDao = async () => {
  const condition1 = await database
    .getRepository(RaidRecord)
    .createQueryBuilder("raidRecord")
    .getCount();

  if (condition1 === 0) {
    return { condition1 };
  }

  const condition2 = await database
    .getRepository(RaidRecord)
    .createQueryBuilder("raidRecord")
    .orderBy("raidRecord.id", "DESC")
    .limit(1)
    .getOne();

  return { condition2 };
};

export default { getRecordDao };
