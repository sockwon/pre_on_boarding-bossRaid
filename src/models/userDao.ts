import database from "./database";
import User from "../entity/User";

const createUserDao = async () => {
  const result = await database
    .createQueryBuilder()
    .insert()
    .into(User)
    .values({})
    .execute();
  return result;
};

export default { createUserDao };
