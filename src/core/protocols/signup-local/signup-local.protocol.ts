import { BodyParams } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { BadRequest } from "@tsed/exceptions";
import { Groups } from "@tsed/schema";
import { UsersService } from "../../../app/services";
import { User } from "../../../app/models";

@Protocol({
  name: "signup",
  useStrategy: Strategy,
  settings: {
    usernameField: "userName",
    passwordField: "password"
  }
})
export class SignupLocalProtocol implements OnVerify, OnInstall {
  constructor(private usersService: UsersService) {
  }

  async $onVerify(@BodyParams() @Groups("create") user: User) {
    const { userName, email } = user;

    const foundUser = await this.usersService.findOne({ userName });
    if (foundUser) {
      throw new BadRequest("User is already registered");
    }

    const foundEmail = await this.usersService.findOne({ email });
    if (foundEmail) {
      throw new BadRequest("Email is already registered");
    }

    return await this.usersService.create(user);
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
