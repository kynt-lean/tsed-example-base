import { Controller, BodyParams, Req, Session } from "@tsed/common";
import { Groups, Post, Returns } from "@tsed/schema";
import { Session as ExpressSession } from "express-session";
import { RouteDecorator } from "../../../core/decorators";
import { User } from "../../models";
import { AuthService } from "../../services";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/login")
  @RouteDecorator({ authenticate: { protocol: "login" } })
  @Returns(200, User).Groups("secret")
  public async login(@Req() req: any, @BodyParams() @Groups("login") user: User) {
    return await this.authService.login(req.user);
  }

  @Post("/logout")
  @Returns(204)
  logout(@Session() session: ExpressSession) {
    session.destroy((err: any) => err);
  }

  @Post("/signup")
  @RouteDecorator({ authenticate: { protocol: "signup" } })
  @Returns(200, User).Groups("read")
  signup(@Session() session: ExpressSession, @Req() req: Req, @BodyParams() @Groups("create") user: User) {
    session.destroy((err: any) => err);
    return req.user;
  }
}