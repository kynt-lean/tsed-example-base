import { ConnectionOptions } from "typeorm"
import { databaseConfig } from "../env"

export const defaultConfig: ConnectionOptions = {
  name: "default",
  type: "postgres",
  host: databaseConfig.host,
  port: databaseConfig.port,
  username: databaseConfig.username,
  password: databaseConfig.password,
  database: databaseConfig.database,
  synchronize: true,
  logging: false,
  entities: [
    "${rootDir}/models/entities/**/*.{js,ts}"
  ],
  migrations: [
    "${rootDir}/models/migrations/**/*.{js,ts}"
  ],
  subscribers: [
    "${rootDir}/models/subscribers/**/*.{js,ts}"
  ],
  cli: {
    "entitiesDir": "${rootDir}/models/entities/**/*.{js,ts}",
    "migrationsDir": "${rootDir}/models/migrations/**/*.{js,ts}",
    "subscribersDir": "${rootDir}/models/subscribers/**/*.{js,ts}"
  }
}