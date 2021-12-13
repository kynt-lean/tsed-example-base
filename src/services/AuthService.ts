import { Injectable } from "@tsed/di";
import { jwtOptions } from "../config/jwt/jwt.config";
import { User } from "../models/entities/User";
import { JwtService, JwtSignOptions } from "./JwtService";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User) {
    const payload = {      
      sub: user.id.toString(),
      usr: user.userName
    };
    return {
      token: this.jwtService.sign(payload, jwtOptions as JwtSignOptions)
    };
  }
}