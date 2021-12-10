import { Description, Example } from "@tsed/schema";

export class UserDto {
  @Description("User id")
  @Example("f6389176-280e-428b-9428-510266d8ce8c")
  id: string;

  @Description("User name")
  @Example("user")
  userName: string;

  @Description("User email")
  @Example("user@domain.com")
  email: string;
 
  @Description("User first name")
  @Example("john")
  firstName: string;

  @Description("User last name")
  @Example("snow")
  lastName: string;

  @Description("User phone number")
  @Example("+84 (274) 339-7799")
  phone: string;

  @Description("User address")
  @Example("352 Duca, Hitan, Tucamo, 999")
  address: string;

  @Description("JWT access token")
  @Example("352 Duca, Hitan, Tucamo, 999")
  access_token: string;
}