import {Description, Example, Format, Required} from "@tsed/schema";

export class Credentials {
  @Description("User name")
  @Example("user")
  @Required()
  userName: string;

  @Description("User email")
  @Example("user@domain.com")
  @Format("email")
  @Required()
  email: string;

  @Description("User password")
  @Example("supersecuritypassword")
  @Required()
  password: string;
}