import { BodyParams, Req } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { IStrategyOptions, Strategy } from "passport-local";
import { Unauthorized } from "@tsed/exceptions";
import { UsersService } from "../services/UsersService";
import { Groups } from "@tsed/schema";
import { User } from "../models/entities/User";

@Protocol<IStrategyOptions>({
  name: "login",
  useStrategy: Strategy,
  settings: {
    usernameField: "userName",
    passwordField: "password"
  }
})
export class LoginLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@Req() request: Req, @BodyParams() @Groups("login") credentials: User) {
    const { userName, password } = credentials;

    const user = await this.usersService.repository.findOne({ where: [{ userName: userName }, {email: userName}] });

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