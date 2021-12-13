import {CollectionOf, Generics, Property} from "@tsed/schema";

@Generics("T")
export class Pagination<T> {
  @CollectionOf("T")
  data: T[];

  @Property()
  totalCount: number;
}