import { Injectable } from "@tsed/common";
import { User } from "../../models/entities/User";
import { JwtService } from "../../../shared/jwt/services/JwtService";

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
      token: this.jwtService.sign(payload)
    };
  }
}