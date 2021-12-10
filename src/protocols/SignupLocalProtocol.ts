import { BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { BadRequest } from "@tsed/exceptions";
import { UsersService } from "../services/UsersService";
import { UserCreation } from "../models/dtos/UserCreation";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() user: UserCreation) {
    const { email } = user;
    const found = await this.usersService.repository.findOne({ email: email });

    if (found) {
      throw new BadRequest("Email is already registered");
    }

    return this.usersService.repository.insert(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
