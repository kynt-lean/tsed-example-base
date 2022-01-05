import { Injectable } from "@tsed/di";
import { User } from "../models/entities/User";
import { UsersRepository } from "../models/repositories/UsersRepository";
import { CrudService } from "./CrudService";

@Injectable()
export class UsersService extends CrudService<User>() {
  constructor(_repository: UsersRepository) {
    super(_repository);
  }
}