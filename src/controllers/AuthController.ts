import { BodyParams, Req } from "@tsed/common";
import { Controller, Intercept } from "@tsed/di";
import { Groups, Post, Returns } from "@tsed/schema";
import { RouteDecorator } from "../decorators/RouteDecorator";
import { SerializeInterceptor } from "../interceptors/SerializeInterceptor";
import { UserDto } from "../models/dtos/UserDto";
import { AuthService } from "../services/AuthService";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @RouteDecorator({ authenticate: { protocol: "login" } })
  @Returns(200, UserDto).Groups("secret")
  @Intercept(SerializeInterceptor, UserDto)
  public async login(@Req() req: any, @BodyParams() @Groups("login") user: UserDto) {
    return await this.authService.login(req.user);
  }

  @Post("/signup")
  @RouteDecorator({ authenticate: { protocol: "signup" } })
  @Returns(200, UserDto).Groups("read")
  @Intercept(SerializeInterceptor, UserDto)
  signup(@Req() req: Req, @BodyParams() @Groups("create") user: UserDto) {
    return req.user;
  }
}