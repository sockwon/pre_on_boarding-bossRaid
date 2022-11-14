import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import database from "../src/models/database";
import dbStart from "../dbStart";

import { createApp } from "../app";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

describe("server test:", () => {
  let app: any;
  let server: any;
  const consoleSpy = jest.spyOn(console, "log");

  beforeAll(() => {
    app = createApp();
    server = app.listen(8001, () => {
      console.log("Listening on Port 8001");
    });
  });
  afterAll(async () => {
    await database.destroy();
    server.close();
  });

  test("test app: success", async () => {
    await request(app).get("/ping").expect(200).expect({ message: "pong" });
  });

  test("test dbStart: success", async () => {
    await dbStart();
    expect(consoleSpy).toHaveBeenLastCalledWith(
      "Data Source has been initialized!"
    );
  });
});
