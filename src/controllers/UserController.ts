import { Controller } from "@tsed/di";
import { UserDto } from "../models/dtos/UserDto";
import { User } from "../models/entities/User";
import { IUsersService, UsersService } from "../services/UsersService";
import { CrudController } from "./CrudController";

@Controller("/users")
export class UsersController extends CrudController<IUsersService, User, UserDto>(User, UserDto) {
  constructor(_service: UsersService) {
    super(_service);
  }
}