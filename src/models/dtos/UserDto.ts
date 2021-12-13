import { Example, Groups } from "@tsed/schema";
import { Exclude, Expose, Transform } from "class-transformer";

@Groups<UserDto>({
  // will generate UserCreate
  create: ["firstName", "lastName", "email", "phone", "address", "userName", "password"],
  // will generate UserUpdate
  update: ["firstName", "lastName", "phone", "address"],
  // will generate UserChangePassword
  changePassword: ["password", "newPassword"],
  // will generate UserRead
  read: ["id", "email", "userName", "fullName", "phone", "address"],
  // will generate UserLogin
  login: ["userName", "password"],
  // will generate UserSecret
  secret: ["token"],
})
export class UserDto {
  @Example("c3c1948e-64a4-4600-bce8-ef75110a59e5")
  id: string;

  @Example("john79")
  userName: string;

  @Example("john@domain.com")
  email: string;

  @Example("supersecuritypassword")
  @Exclude()
  password: string;

  @Example("changedpassword")
  newPassword: string;
  
  @Example("john")
  @Exclude()
  firstName: string;

  @Example("snow")
  @Exclude()
  lastName: string;

  @Example("john snow")
  @Expose()
  @Transform(({ obj }) => `${obj.firstName} ${obj.lastName}`)
  fullName: string;

  @Example("+00 (000) 000-00000")
  phone: string;

  @Example("any place")
  address: string;

  @Example("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkMzBiOTcwNC1kNTExLTQ0ZmEtYTM4NS0yZWE4OTE2NjdlMWUiLCJ1c3IiOiJzb21lb25lIiwiaWF0IjoxNjM5Mzg2MTY2LCJleHAiOjE2Mzk0NzI1NjZ9.KTTH8hQnPY8CK6U_9xfb4gL6Gq-4xKxnnOosKGyJjjM")
  token: string;
}