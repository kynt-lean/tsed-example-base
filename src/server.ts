import "@tsed/platform-express";
import "@tsed/ajv";
import "@tsed/swagger";
import "@tsed/typeorm";
import "@tsed/passport";
import { PlatformApplication, Configuration, Inject } from "@tsed/common";
import bodyParser from "body-parser";
import compress from "compression";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import cors from "cors";
import session from "express-session";
import { config, sessionOptions } from "./config";

@Configuration({
  ...config
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
      .use(session(sessionOptions));
  }
}