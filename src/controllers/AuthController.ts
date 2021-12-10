import { BodyParams, Req } from "@tsed/common";
import { Controller } from "@tsed/di";
import { Authenticate } from "@tsed/passport";
import { Post } from "@tsed/schema";
import { Credentials } from "../models/dtos/Credentials";
import { UserCreation } from "../models/dtos/UserCreation";
import { AuthService } from "../services/AuthService";

@Controller("/auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("/login")
  @Authenticate("login")
  public async login(@Req() req: any, @BodyParams() credentials: Credentials) {
    return await this.authService.login(req.user);
  }

  @Post("/signup")
  @Authenticate("signup")
  signup(@Req() req: Req, @BodyParams() user: UserCreation) {
    return req.user;
  }
}