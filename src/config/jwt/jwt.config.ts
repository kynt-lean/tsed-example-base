import { JwtSignOptions, JwtVerifyOptions } from "../../services/JwtService";

export const jwtOptions: JwtSignOptions | JwtVerifyOptions = {
  secret: "jtw screte",
  privateKey: "papa screte",
  expiresIn: "1d"
};