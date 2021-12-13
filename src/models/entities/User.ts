import { Property } from "@tsed/schema";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  @Property()
  id: string;

  @Column()
  @Property()
  userName: string;

  @Column()
  @Property()
  email: string;

  @Column()
  @Property()
  password: string;
  
  @Column()
  @Property()
  firstName: string;

  @Column()
  @Property()
  lastName: string;

  @Column()
  @Property()
  phone: string;

  @Column()
  @Property()
  address: string;

  verifyPassword(password: string) {
    return this.password === password;
  }
}