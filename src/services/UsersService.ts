import { Injectable } from "@tsed/di";
import { User } from "../models/entities/User";
import { UsersRepository } from "../models/repositories/UsersRepository";
import { CrudService, ICrudService } from "./CrudService";

export interface IUsersService extends ICrudService<User> {}

@Injectable()
export class UsersService extends CrudService<User>() implements IUsersService {
  constructor(_repository: UsersRepository) {
    super(_repository);
  }
}