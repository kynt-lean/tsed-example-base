import { JwtConfigOptions } from "../../shared/jwt";

export const jwtConfig: JwtConfigOptions = {
  secret: "jtw screte",
  privateKey: "papa screte",
  expiresIn: "1d",
  issuer: "accounts.examplesoft.com",
  audience: "yoursite.net"
};