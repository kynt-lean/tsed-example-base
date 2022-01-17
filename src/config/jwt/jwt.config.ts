import { JwtConfigOptions } from "../../shared/jwt";
import { jwtEnv } from "../env";

export const jwtConfig: JwtConfigOptions = {
  secret: jwtEnv.secret,  
  issuer: jwtEnv.issuer,
  audience: jwtEnv.audience,
  expiresIn: jwtEnv.expiresIn,
};