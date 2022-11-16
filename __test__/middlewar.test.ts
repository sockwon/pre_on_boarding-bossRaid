import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import { erorrGenerator } from "../src/middlewares/errorGenerator";
import errorHandlerAsync from "../src/middlewares/errorHandler";
import { Request, Response } from "express";
import { rankDataProcess } from "../src/middlewares/processRankingData";
import { redisConnect } from "../src/middlewares/redis";

import { describe, test, expect, beforeAll, afterAll } from "@jest/globals";

describe("middlware test:", () => {
  test("error Generator: statuscode", () => {
    try {
      erorrGenerator(999);
    } catch (err: any) {
      expect(err.statusCode).toBe(999);
    }
  });

  test("error Generator: message", () => {
    try {
      erorrGenerator(999, "test");
    } catch (err: any) {
      expect(err.message).toBe("test");
    }
  });

  test("rankDataProcess:", async () => {
    const userId = 1;
    const ranking = [
      {
        userId: 1,
        totalScore: 753,
        ranking: 1,
      },
      {
        userId: 3,
        totalScore: 255,
        ranking: 2,
      },
      {
        userId: 2,
        totalScore: 125,
        ranking: 3,
      },
    ];
    const data = await rankDataProcess(userId, ranking);
    expect(data).toBeDefined();
    expect(data.myRankingInfo).toEqual({
      userId: 1,
      totalScore: 753,
      ranking: 0,
    });
  });

  test("redis: redis server", async () => {
    const infoSpy = jest.spyOn(console, "info");
    await redisConnect();

    expect(infoSpy).toHaveBeenLastCalledWith("Redis Connected");
  });

  test("redis: get, set", async () => {
    const redisCli = await redisConnect();
    await redisCli.set("test", "success");
    await redisCli.expire("test", 5);
    const result = await redisCli.get("test");
    expect(result).toBe("success");
  });
});
