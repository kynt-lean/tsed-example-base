import { Controller } from "@tsed/di";
import { User } from "../models/entities/User";
import { UsersService } from "../services/UsersService";
import { CrudController } from "./CrudController";

@Controller("/users")
export class UsersController extends CrudController<UsersService, User>(User) {
  constructor(_service: UsersService) {
    super(_service);
  }
}