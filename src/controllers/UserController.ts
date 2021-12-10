import { Controller } from "@tsed/di";
import { UserCreation } from "../models/dtos/UserCreation";
import { UserDto } from "../models/dtos/UserDto";
import { User } from "../models/entities/User";
import { IUsersService, UsersService } from "../services/UsersService";
import { CrudController } from "./CrudController";

@Controller("/users")
export class UsersController extends CrudController<IUsersService, User, UserCreation, UserCreation, UserDto>(UserDto) {
  constructor(_service: UsersService) {
    super(_service);
  }
}