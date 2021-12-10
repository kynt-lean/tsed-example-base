import { JwtSignOptions, JwtVerifyOptions } from "../../services/JwtService";

export const jwtOptions: JwtSignOptions | JwtVerifyOptions = {
  secret: "this is my super secret key for jwt",
  privateKey: "private secret",
  expiresIn: "1d"
};