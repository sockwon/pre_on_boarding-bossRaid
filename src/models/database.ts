/**
 * Module dependencies.
 */

import { DataSource } from "typeorm";

/**
 * typeORM 사용. 데이터베이스와 연결 설정. 구동은 server.js 에서.
 */

const database = new DataSource({
  type: "mysql",
  host: process.env.TYPEORM_HOST,
  port: 3306,
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: false,
  synchronize: true,
  entities: [],
  charset: "utf8mb4",
});

/**
 * Module exports.
 * @public
 */

export default database;
