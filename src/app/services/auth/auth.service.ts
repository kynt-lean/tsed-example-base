import { Injectable } from "@tsed/common";
import { JwtService } from "../../../shared/jwt";
import { User } from "../../models/entities/user";

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