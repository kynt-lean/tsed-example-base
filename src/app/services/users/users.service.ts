import { Injectable } from "@tsed/common";
import { MemoryCollection } from "../../../shared/utils";
import { User } from "../../models/entities/user";

@Injectable()
export class UsersService extends MemoryCollection<User> {
  constructor() {
    super(User, "assets/data/users.json");
  }

  async findById(id: string) {
    return await this.findOne({id: id});
  }
}