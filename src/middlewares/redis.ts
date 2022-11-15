import express from "express";
import redis from "redis";

const redisConnect = async () => {
  const redisClient = redis.createClient({
    legacyMode: true,
    socket: {
      host: "127.0.0.1",
      port: 6379,
    },
  });

  redisClient.on("connect", () => {
    console.info("Redis Connected");
  });
  redisClient.on("error", (err) => {
    console.error("Redis Client Error", err);
  });

  await redisClient.connect().then();
  return redisClient.v4;
};

export default { redisConnect };
