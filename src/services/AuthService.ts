import { Injectable } from "@tsed/di";
import { jwtOptions } from "../config/jwt/jwt.config";
import { UserDto } from "../models/dtos/UserDto";
import { User } from "../models/entities/User";
import { JwtService, JwtSignOptions } from "./JwtService";

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
  ) {}

  async login(user: User): Promise<UserDto> {
    const payload = {      
      sub: user.id.toString(),
      usr: user.userName
    };
    return {
      ...user,
      access_token: this.jwtService.sign(payload, jwtOptions as JwtSignOptions)
    } as UserDto;
  }
}