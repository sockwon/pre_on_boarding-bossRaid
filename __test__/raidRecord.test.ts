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
    await database.query(`TRUNCATE raid_record`);
    await database.query(`TRUNCATE user`);
    await database.query(`SET foreign_key_checks = 1`);

    await database.destroy();
  });

  describe("raidRecord test:", () => {
    test("boss raid get: 상태조회 success", () => {
      request(app)
        .get("/bossraid")
        .expect(200)
        .expect({ canEnter: true, enteredUserId: null });
    });

    test("boss raid start: success", () => {
      request(app)
        .post("/bossRaid/enter")
        .send({
          userId: 1,
          level: 1,
        })
        .expect(201)
        .expect({
          isEntered: true,
          raidRecordId: 1,
        });
    });

    test("boss raid start: fail", () => {
      request(app)
        .post("/bossRaid/enter")
        .send({
          userId: 1,
          level: 4,
        })
        .expect(500);
    });

    test("boss raid end: success", () => {
      request(app)
        .patch("/bossRaid/end")
        .send({
          userId: 1,
          raidRecordId: 1,
        })
        .expect(201);
    });

    test("boss raid end: fail", () => {
      request(app)
        .patch("/bossRaid/end")
        .send({
          userId: 2,
          raidRecordId: 1,
        })
        .expect(403);
    });

    test("boss raid ranking: success", () => {
      request(app)
        .get("/bossRaid/topRankerList")
        .send({
          userId: 1,
        })
        .expect(200);
    });
  });
});
