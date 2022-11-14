import raidRecordDao from "../models/raidRecordDao";
import { IRaidRecord } from "../interfaces/IRaidRecord";

const getRaidRecord = async () => {
  const result = await raidRecordDao.getRecordDao();
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

export default { getRaidRecord };
