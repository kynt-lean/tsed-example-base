import { BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { Unauthorized } from "@tsed/exceptions";
import { UsersService } from "../services/UsersService";
import { Credentials } from "../models/dtos/Credentials";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "email",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() credentials: Credentials) {
    const { email, password } = credentials;

    const user = await this.usersService.repository.findOne({ email: email });

    if (!user) {
      throw new Unauthorized("User is not exist");
    }

    if (!user.verifyPassword(password)) {
      throw new Unauthorized("Wrong credentials");
    }

    return user;
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}