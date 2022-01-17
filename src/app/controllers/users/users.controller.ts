import { Controller } from "@tsed/common";
import { MessagePattern } from "../../../shared/microservices";
import { UsersService } from "../../services";

@Controller("/users")
export class UsersController {
  constructor(protected readonly service: UsersService) {}

  @MessagePattern({ cmd: 'find-user' })
  async findUser(userName: string) {
    const user = await this.service.findOne({ userName });
    return user ? user : "NO DATA FOUND";
  }
}