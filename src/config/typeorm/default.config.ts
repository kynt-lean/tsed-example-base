import { ConnectionOptions } from "typeorm";
import { DbEnv } from "../env";

export const defaultConfig: ConnectionOptions = {
  name: "default",
  type: "mssql",
  host: DbEnv.host,
  port: DbEnv.port,
  username: DbEnv.username,
  password: DbEnv.password,
  database: DbEnv.database,
  synchronize: false,
  logging: false,
  entities: [
    "${rootDir}/app/models/entities/**/*.{js,ts}"
  ],
  migrations: [
    "${rootDir}/app/models/migrations/**/*.{js,ts}"
  ],
  subscribers: [
    "${rootDir}/app/models/subscribers/**/*.{js,ts}"
  ],
  cli: {
    "entitiesDir": "${rootDir}/app/models/entities",
    "migrationsDir": "${rootDir}/app/models/migrations",
    "subscribersDir": "${rootDir}/app/models/subscribers"
  },
  options: {
    encrypt: false
  }
};