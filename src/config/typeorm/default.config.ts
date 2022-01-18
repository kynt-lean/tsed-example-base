import { join } from "path";
import { dbEnv } from "../env";

const rootDir = join(__dirname, "..", "..");

export = {
  name: "default",
  type: "postgres",
  host: dbEnv.host,
  port: dbEnv.port,
  username: dbEnv.username,
  password: dbEnv.password,
  database: dbEnv.database,
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