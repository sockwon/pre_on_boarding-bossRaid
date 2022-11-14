import database from "./src/models/database";

const dbStart = async () => {
  await database
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err: any) => {
      console.error("Error during Data Source initialization", err);
      database.destroy();
    });
};

export default dbStart;
