import { IRankingInfo } from "../interfaces/IUser";

const rankDataProcess = async (userId: number, ranking: IRankingInfo[]) => {
  let userRanking;

  await ranking.forEach((obj: IRankingInfo) => {
    obj.ranking = +obj.ranking - 1;
    if (userId === +obj.userId) {
      userRanking = obj;
    }
  });

  const result = {
    topRankerInfoList: ranking,
    myRankingInfo: userRanking,
  };

  return result;
};

export { rankDataProcess };
