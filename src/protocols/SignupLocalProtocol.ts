import { BodyParams } from "@tsed/common";
import { OnInstall, OnVerify, Protocol } from "@tsed/passport";
import { Strategy } from "passport-local";
import { BadRequest } from "@tsed/exceptions";
import { UsersService } from "../services/UsersService";
import { Groups } from "@tsed/schema";
import { User } from "../models/entities/User";

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

    const foundUser = await this.usersService.repository.findOne({ userName: userName });
    if (foundUser) {
      throw new BadRequest("User is already registered");
    }
    
    const foundEmail = await this.usersService.repository.findOne({ email: email });
    if (foundEmail) {
      throw new BadRequest("Email is already registered");
    }

    const inserted = await this.usersService.repository.insert(user);
    return this.usersService.repository.findOne(inserted.identifiers.find(() => true));    
  }

  $onInstall(strategy: Strategy): void {
    // intercept the strategy instance to adding extra configuration
  }
}
