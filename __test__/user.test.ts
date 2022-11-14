import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import database from "../src/models/database";
import User from "../src/entity/User";

import { createApp } from "../app";
import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

describe("user test:", () => {
  let app: any;
  beforeAll(async () => {
    app = createApp();
    await database.initialize();
    await database
      .createQueryBuilder()
      .insert()
      .into(User)
      .values({})
      .execute();
  });
  afterAll(async () => {
    await database.query(`SET foreign_key_checks = 0`);
    await database.query(`TRUNCATE user`);
    await database.query(`SET foreign_key_checks = 1`);

    await database.destroy();
  });

  test("user create: success", async () => {
    await request(app).post("/user").send({}).expect(201).expect({ userId: 2 });
  });
});
