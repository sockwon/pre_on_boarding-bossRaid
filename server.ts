/**
 * Module dependencies.
 */

import dotenv from "dotenv";
dotenv.config();

import { createApp } from "./app";
import database from "./src/models/database";

/**
 * Initialize the server.
 *
 *   - setup default configuration
 *   - setup default middleware
 * @public
 */

const startServer = async () => {
  const app = createApp();
  const PORT = process.env.PORT;

  await database
    .initialize()
    .then(() => {
      console.log("Data Source has been initialized!");
    })
    .catch((err: any) => {
      console.error("Error during Data Source initialization", err);
      database.destroy();
    });

  app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`);
  });
};

startServer();
