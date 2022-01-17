import { Injectable } from "@tsed/common";
import { MemoryCollection } from "../../../shared/utils";
import { User } from "../../models";

@Injectable()
export class UsersService extends MemoryCollection<User> {
  constructor() {
    super(User, "assets/data/users.json");
  }
}