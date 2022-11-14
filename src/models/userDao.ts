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
  const totalScore = await database
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.totalScore")
    .where("user.id =:id", { id: userId })
    .getOne();

  const raidHistory = await database
    .getRepository(RaidRecord)
    .createQueryBuilder("a")
    .select(["a.id", "a.score", "a.enterTime", "a.endTime"])
    .where("a.userId =:id", { id: userId })
    .getMany();

  const result = {
    totalScore: totalScore?.totalScore,
    bossRaidHistory: raidHistory,
  };

  return result;
};

export default { createUserDao, getUserDao };
