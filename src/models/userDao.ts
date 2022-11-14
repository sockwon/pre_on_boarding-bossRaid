import database from "./database";
import User from "../entity/User";
import RaidRecord from "../entity/RaidRecord";

const createUserDao = async () => {
  const result = await database
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({})
    .execute();
  return result;
};

const getUserDao = async (userId: number) => {
  const result = await database
    .getRepository(User)
    .createQueryBuilder("user")
    .leftJoinAndSelect(RaidRecord, "raidRecord", "raidRecord.userId = user.id")
    .where("user.id =:id", { id: userId })
    .getMany();
  return result;
};

export default { createUserDao, getUserDao };
