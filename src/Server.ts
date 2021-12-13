import {Configuration, Inject} from "@tsed/di";
import {PlatformApplication} from "@tsed/common";
import "@tsed/platform-express";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/typeorm";
import "@tsed/passport";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import {config, rootDir} from "./config";
import { IndexCtrl } from "./controllers/pages/IndexController";
import { UserDto } from "./models/dtos/UserDto";


@Configuration({
  ...config,
  acceptMimes: ["application/json"],
  httpPort: process.env.PORT || 8089,
  httpsPort: false,
  mount: {
    "/rest/v1": [
      `${rootDir}/controllers/**/*.ts`
    ],
    "/": [
      IndexCtrl
    ]
  },
  swagger: [
    {
      path: "/v1/docs",
      specVersion: "3.0.1"
    }
  ],
  views: {
    root: `${rootDir}/views`,
    extensions: {
      ejs: "ejs"
    }
  },
  exclude: [
    "**/*.spec.ts"
  ],
  componentsScan: [
    `${rootDir}/protocols/*.ts`
  ],
  passport: {
    userInfoModel: UserDto
  }
})
export class Server {
  @Inject()
  app: PlatformApplication;

  @Configuration()
  settings: Configuration;

  $beforeRoutesInit(): void {
    this.app
      .use(cors())
      .use(cookieParser())
      .use(compress({}))
      .use(methodOverride())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({
        extended: true
      }))
      .use(session({
        secret: "keyboard cat",
        resave: false,
        saveUninitialized: true,
        cookie: {
          secure: false
        }
      }));
  }
}
