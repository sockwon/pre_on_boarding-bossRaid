import database from "./database";
import User from "../entity/User";
import RaidRecord from "../entity/RaidRecord";

/**
 * 있는 유저인지 찾아준다.
 * @param userId
 * @returns rawpacket
 */
const isUser = async (userId: number) => {
  return await database.query(
    `
  SELECT EXISTS(SELECT * FROM user WHERE user.id= ?)
  `,
    [userId]
  );
};

/**
 * 유저를 생성한다.
 * @returns
 */
const createUserDao = async () => {
  const result = await database
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({})
    .execute();
  return result;
};

/**
 * 유저의 totalScore 정보를 반환한다.
 * @param userId
 * @returns totalScore
 */
const getTotalScore = async (userId: number) => {
  const totalScore = await database
    .getRepository(User)
    .createQueryBuilder("user")
    .select("user.totalScore")
    .where("user.id =:id", { id: userId })
    .getOne();

  return totalScore;
};

/**
 * 유저의 raid_record 정보를 반환한다.
 * @param userId
 * @returns raidHistory
 */
const getRaidHistory = async (userId: number) => {
  const raidHistory = await database
    .getRepository(RaidRecord)
    .createQueryBuilder("a")
    .select(["a.id", "a.score", "a.enterTime", "a.endTime"])
    .where("a.userId =:id", { id: userId })
    .getMany();

  return raidHistory;
};

/**
 * 유저의 totalScore 와 raid_record 정보를 반환하는 함수를 호출한다. 이들 정보를 오브젝트로 반환한다.
 * @param userId
 * @returns
 */
const getUserDao = async (userId: number) => {
  const totalScore = await getTotalScore(userId);
  const raidHistory = await getRaidHistory(userId);
  const result = {
    totalScore: totalScore,
    bossRaidHistory: raidHistory,
  };

  return result;
};

/**
 * 유저의 랭킹 정보를 데이터베이스에서 반환한다.
 * @returns
 */
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
