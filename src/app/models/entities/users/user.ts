import { OnSerialize } from "@tsed/json-mapper";
import { Groups, Property, Required, RequiredGroups } from "@tsed/schema";

@Groups<User>({
  // will generate create schema
  create: ["firstName", "lastName", "email", "phone", "address", "userName", "password"],
  // will generate update schema
  update: ["firstName", "lastName", "phone", "address"],
  // will generate change password schema
  changePassword: ["password", "newPassword"],
  // will generate read schema
  read: ["id", "email", "userName", "fullName", "phone", "address"],
  // will generate login schema
  login: ["userName", "password"],
  // will generate secret schema
  secret: ["token"],
  // will generate criteria schema
  criteria: ["id", "email", "userName", "firstName", "lastName", "phone", "address"]
})
export class User {
  @Property()
  id: string;

  @RequiredGroups("!criteria")
  @Required()
  userName: string;

  @RequiredGroups("!criteria")
  @Required()
  email: string;

  @RequiredGroups("!criteria")
  @Required()
  password: string;
  
  @RequiredGroups("!criteria")
  @Required()
  firstName: string;

  @RequiredGroups("!criteria")
  @Required()
  lastName: string;

  @Property()
  phone: string;

  @Property()
  address: string;

  @OnSerialize((v, ctx) => `${ctx.self.firstName} ${ctx.self.lastName}`)
  fullName: string;

  @RequiredGroups("changePassword")
  @Required()
  newPassword: string;

  @Property()
  token: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}