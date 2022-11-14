import raidRecordDao from "../models/raidRecordDao";
import { IRaidRecord, IRaidRecordInput } from "../interfaces/IRaidRecord";

const checkRecord = async () => {
  const result = await raidRecordDao.checkRecordDao();
  const value = {
    canEnter: true,
    enteredUserId: null,
  };

  if (result["condition1"] === 0) {
    return value;
  }

  if (result["condition2"]) {
  }
};

const startRaid = async (data: IRaidRecordInput) => {
  const result = await raidRecordDao.startRaidDao(data);
  return result;
};

export default { checkRecord, startRaid };
