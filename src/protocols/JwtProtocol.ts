import { Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { jwtOptions } from "../config/jwt/jwt.config";
import { UsersService } from "../services/UsersService";

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtOptions.secret,
    issuer: jwtOptions.issuer,
    audience: jwtOptions.audience
  }
})
export class JwtProtocol implements OnVerify {
  constructor(private usersService: UsersService) {}

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.usersService.repository.findOne({id: jwtPayload.sub});

    if (!user) {
      throw new Unauthorized("Wrong token");
    }

    return user ? user : false;
  }
}