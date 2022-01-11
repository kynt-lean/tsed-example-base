import { OnSerialize } from "@tsed/json-mapper";
import { Groups, Property, Required, RequiredGroups } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// @Entity("users")
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
  @PrimaryGeneratedColumn("uuid")
  @Property()
  id: string;

  @Column()
  @RequiredGroups("!criteria")
  @Required()
  userName: string;

  @Column()
  @RequiredGroups("!criteria")
  @Required()
  email: string;

  @Column()
  @RequiredGroups("!criteria")
  @Required()
  password: string;
  
  @Column()
  @RequiredGroups("!criteria")
  @Required()
  firstName: string;

  @Column()
  @RequiredGroups("!criteria")
  @Required()
  lastName: string;

  @Column({ nullable: true })
  @Property()
  phone: string;

  @Column({ nullable: true })
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