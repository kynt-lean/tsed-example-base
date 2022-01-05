import { BodyParams, Req } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Groups, Post, Returns } from "@tsed/schema";
import { RouteDecorator } from "../decorators/RouteDecorator";
import { User } from "../models/entities/User";
import { AuthService } from "../services/AuthService";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @RouteDecorator({ authenticate: { protocol: "login" } })
  @Returns(200, User).Groups("secret")
  public async login(@Req() req: any, @BodyParams() @Groups("login") user: User) {
    return await this.authService.login(req.user);
  }

  @Post("/signup")
  @RouteDecorator({ authenticate: { protocol: "signup" } })
  @Returns(200, User).Groups("read")
  signup(@Req() req: Req, @BodyParams() @Groups("create") user: User) {
    return req.user;
  }
}