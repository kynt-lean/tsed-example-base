import { SessionOptions } from "express-session";
import { join } from "path";
import { IndexController } from "../app/home/index.controller";
import { appEnv } from "./env";
import { loggerConfig } from "./logger";
import { jwtConfig } from "./jwt";
import { typeormConfig } from "./typeorm";
import { rmqConfig } from "./microservices";
import { User } from "../app/models";

const { version } = require("../../package.json");
export const rootDir = join(__dirname, "..");
const prefix = appEnv.prefix;
const apiVersion = "v1";
const baseRoute = `/${prefix}/${apiVersion}`;

export const config: Partial<TsED.Configuration> = {
  version,
  rootDir,
  logger: loggerConfig,  
  acceptMimes: ["application/json"],
  httpPort: appEnv.httpPort,
  httpsPort: false,
  mount: {
    [baseRoute]: [
      `${rootDir}/app/controllers/**/*.ts`
    ],
    "/": [
      IndexController
    ]
  },
  swagger: [
    {
      path: `${baseRoute}/docs`,
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
    // `${rootDir}/app/jobs/**/*.ts`,
  ],
  passport: {
    userInfoModel: User
  },  
  schedule: {
    enabled: false
  },
  jwt: jwtConfig,
  // typeorm: typeormConfig,
  microservice: rmqConfig
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