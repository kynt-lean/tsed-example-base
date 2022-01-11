import { SessionOptions } from "express-session";
import { join } from "path";
import { IndexController } from "../app/home/IndexController";
import { User } from "../app/models/entities/User";
import { appConfig } from "./env";
import { jwtConfig } from "./jwt";
import { loggerConfig } from "./logger";
import typeormConfig from "./typeorm";

const { version } = require("../../package.json");
export const rootDir = join(__dirname, "..");

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,
  typeorm: typeormConfig,
  acceptMimes: ["application/json"],
  httpPort: appConfig.httpPort,
  httpsPort: false,
  mount: {
    "/rest/v1": [
      `${rootDir}/app/controllers/**/*.ts`
    ],
    "/": [
      IndexController
    ]
  },
  swagger: [
    {
      path: "/v1/docs",
      specVersion: "3.0.1",
      spec: {
        components: {
          securitySchemes: {
            bearer: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT",
              description: "Jwt description"
            }
          }
        }
      }
    }
  ],
  views: {
    root: `${rootDir}/app/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ],
  componentsScan: [
    `${rootDir}/core/protocols/**/*.ts`,
    // `${rootDir}/app/jobs/**/*.ts`
  ],
  passport: {
    userInfoModel: User
  },
  jwt: jwtConfig,
  schedule: {
    enabled: false
  }
};

export const sessionOptions: SessionOptions = {
  secret: "jtw screte",
  resave: false,
  saveUninitialized: false,
  unset: 'destroy',
  cookie: {
    secure: false
  }
};