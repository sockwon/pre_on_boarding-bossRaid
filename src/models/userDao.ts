import database from "./database";
import User from "../entity/User";
import RaidRecord from "../entity/RaidRecord";

const isUser = async (userId: number) => {
  return await database.query(
    `
  SELECT EXISTS(SELECT * FROM user WHERE user.id= ?)
  `,
    [userId]
  );
};

const createUserDao = async () => {
  const result = await database
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({})
    .execute();
  return result;
};

const getTotalScore = async (userId: number) => {
  const totalScore = await database
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.totalScore")
    .where("user.id =:id", { id: userId })
    .getOne();

  return totalScore;
};

const getRaidHistory = async (userId: number) => {
  const raidHistory = await database
    .getRepository(RaidRecord)
    .createQueryBuilder("a")
    .select(["a.id", "a.score", "a.enterTime", "a.endTime"])
    .where("a.userId =:id", { id: userId })
    .getMany();

  return raidHistory;
};

const getUserDao = async (userId: number) => {
  const totalScore = await getTotalScore(userId);
  const raidHistory = await getRaidHistory(userId);
  const result = {
    totalScore: totalScore,
    bossRaidHistory: raidHistory,
  };

  return result;
};

const getTopRankerInfoListDao = async () => {
  return await database.query(`
    SELECT 
    user.id userId, 
    user.totalScore, 
    dense_rank() over (order by totalScore desc) as ranking 
    FROM user
  `);
};

export default { isUser, createUserDao, getUserDao, getTopRankerInfoListDao };
