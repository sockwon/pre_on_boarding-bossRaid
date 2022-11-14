import userDao from "../models/userDao";
import Joi from "joi";

const schemaGetUser = Joi.object({
  userId: Joi.number().required(),
});

const createUser = async () => {
  return await userDao.createUserDao();
};

const getUser = async (userId: number) => {
  await schemaGetUser.validateAsync({ userId });
  return await userDao.getUserDao(userId);
};

export default { createUser, getUser };
