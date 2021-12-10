import { MaxLength, Property, Required } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Property()
  id: string;

  @Column()
  @MaxLength(256)
  @Required()
  userName: string;

  @Column()
  @MaxLength(256)
  @Required()
  email: string;

  @Column()
  @MaxLength(256)
  @Required()
  password: string;
  
  @Column()
  @MaxLength(256)
  @Required()
  firstName: string;

  @Column()
  @MaxLength(256)
  @Required()
  lastName: string;

  @Column()
  @MaxLength(256)
  phone: string;

  @Column()
  @MaxLength(256)
  address: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}