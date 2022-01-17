import { DbEnv } from "../env";
import { rootDir } from "..";

export = {
  name: "default",
  type: "postgres",
  host: DbEnv.host,
  port: DbEnv.port,
  username: DbEnv.username,
  password: DbEnv.password,
  database: DbEnv.database,
  synchronize: false,
  logging: false,
  entities: [
    `${rootDir}/app/models/entities/**/*.{js,ts}`
  ],
  migrations: [
    `${rootDir}/app/models/migrations/**/*.{js,ts}`
  ],
  subscribers: [
    `${rootDir}/app/models/subscribers/**/*.{js,ts}`
  ],
  cli: {
    "entitiesDir": `${rootDir}/app/models/entities`,
    "migrationsDir": `${rootDir}/app/models/migrations`,
    "subscribersDir": `${rootDir}/app/models/subscribers`
  }
};