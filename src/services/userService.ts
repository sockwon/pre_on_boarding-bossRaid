import userDao from "../models/userDao";

const createUser = async () => {
  return await userDao.createUserDao();
};

export default { createUser };
