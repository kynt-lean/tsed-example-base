import { BodyParams } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { BadRequest } from "@tsed/exceptions";
import { UsersService } from "../services/UsersService";
import { Groups } from "@tsed/schema";
import { UserDto } from "../models/dtos/UserDto";

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

  async $onVerify(@BodyParams() @Groups("create") user: UserDto) {
    const { userName, email } = user;
    const found = await this.usersService.repository.findOne({ where: [{ userName: userName }, {email: email}] });

    if (found) {
      throw new BadRequest("Email is already registered");
    }

    const inserted = await this.usersService.repository.insert(user);
    return this.usersService.repository.findOne(inserted.identifiers.find(() => true));
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
