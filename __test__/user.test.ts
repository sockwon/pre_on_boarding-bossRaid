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
  });

  afterAll(async () => {
    await database.query(`SET foreign_key_checks = 0`);
    await database.query(`TRUNCATE user`);
    await database.query(`TRUNCATE raid_record`);
    await database.query(`SET foreign_key_checks = 1`);

    await database.destroy();
  });

  test("user create: success", async () => {
    await request(app).post("/user").send({}).expect(201).expect({ userId: 1 });
  });

  test("get user: success", async () => {
    await request(app).get("/user/1").expect(200);
  });

  test("get user: fail", async () => {
    await request(app).get("/user/999").expect(401);
  });
});
