import { BodyParams, Controller, Req, Session } from "@tsed/common";
import { Get, Groups, Post } from "@tsed/schema";
import { Session as ExpressSession } from "express-session";
import { RouteDecorator } from "../../../core/decorators";
import { User } from "../../models";
import { AuthService } from "../../services";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("/login")
  @RouteDecorator({ authenticate: { protocol: "login-local" }, security: { noSecurity: true }, success: { model: User, groups: "secret" } })
  public async login(@Req() req: any, @BodyParams() @Groups("login") user: User) {
    return await this.authService.login(req.user);
  }

  @Get("/logout")
  @RouteDecorator({ success: { statusCode: 204, description: "No Content" } })
  logout(@Session() session: ExpressSession) {
    session.destroy((err: any) => err);
  }
}