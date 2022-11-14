import userDao from "../models/userDao";

const createUser = async () => {
  return await userDao.createUserDao();
};

const getUser = async (userId: number) => {
  return await userDao.getUserDao(userId);
};

export default { createUser, getUser };
