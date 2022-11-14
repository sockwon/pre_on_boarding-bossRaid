import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import database from "../src/models/database";
import dbStart from "../dbStart";

import { createApp } from "../app";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

describe("server test:", () => {
  let app: any;
  const consoleSpy = jest.spyOn(console, "log");

  beforeAll(() => {
    app = createApp();
  });
  afterAll(async () => {
    await database.destroy();
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
