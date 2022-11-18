import dotenv from "dotenv";
dotenv.config();

import request from "supertest";
import { erorrGenerator } from "../src/middlewares/errorGenerator";
import errorHandlerAsync from "../src/middlewares/errorHandler";
import { NextFunction, Request, Response } from "express";
import { rankDataProcess } from "../src/middlewares/processRankingData";
import * as redis from "../src/middlewares/redis";

import {
  describe,
  test,
  expect,
  beforeAll,
  afterAll,
  afterEach,
} from "@jest/globals";
import { createApp } from "../app";

describe("middlware test:", () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

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
    await redis.redisConnect();

    expect(infoSpy).toHaveBeenLastCalledWith("Redis Connected");
  });

  test("redis: server get, set", async () => {
    const redisCli = await redis.redisConnect();
    await redisCli.set("test", "success");
    await redisCli.expire("test", 5);
    const result = await redisCli.get("test");
    expect(result).toBe("success");
  });

  test("redis: isExist", async () => {
    const result = await redis.isExist();
    expect(result).toBeDefined();
  });

  test("redis: getRankingDataFromRedis", async () => {
    const result = await redis.getRankingDataFromRedis();
    expect(result).toBeDefined();
  });
});
