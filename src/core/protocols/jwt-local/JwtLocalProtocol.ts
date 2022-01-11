import { Req } from "@tsed/common";
import { Unauthorized } from "@tsed/exceptions";
import { Arg, OnVerify, Protocol } from "@tsed/passport";
import { ExtractJwt, Strategy, StrategyOptions } from "passport-jwt";
import { UsersService } from "../../../app/services/users/UsersService";
import { jwtConfig } from "../../../config/jwt";

@Protocol<StrategyOptions>({
  name: "jwt",
  useStrategy: Strategy,
  settings: {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: jwtConfig.secret,
    issuer: jwtConfig.issuer,
    audience: jwtConfig.audience
  }
})
export class JwtProtocol implements OnVerify {
  constructor(private usersService: UsersService) { }

  async $onVerify(@Req() req: Req, @Arg(0) jwtPayload: any) {
    const user = await this.usersService.findOne({ id: jwtPayload.sub });

    if (!user) {
      throw new Unauthorized("Wrong token");
    }

    return user ? user : false;
  }
}