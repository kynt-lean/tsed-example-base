import { Serializer } from "../interfaces";

export class IdentitySerializer implements Serializer {
  serialize(value: any) {
    return value;
  }
}