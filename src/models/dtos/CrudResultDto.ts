import { AdditionalProperties, CollectionOf, Property } from "@tsed/schema";
import { DeleteResult, InsertResult, UpdateResult } from "typeorm";

@AdditionalProperties(true)
export class ObjectLiteralDto {
  [key: string]: any;
}

export class InsertResultDto extends InsertResult {
  /**
   * Contains inserted entity id.
   * Has entity-like structure (not just column database name and values).
   */
  @CollectionOf(ObjectLiteralDto)
  declare identifiers: ObjectLiteralDto[];
  /**
   * Generated values returned by a database.
   * Has entity-like structure (not just column database name and values).
   */
  @CollectionOf(ObjectLiteralDto)
  declare generatedMaps: ObjectLiteralDto[];
  /**
   * Raw SQL result returned by executed query.
   */
  @Property()
  declare raw: any;
}

export class UpdateResultDto extends UpdateResult {
  /**
   * Raw SQL result returned by executed query.
   */
  @Property()
  declare raw: any;
  /**
   * Number of affected rows/documents
   * Not all drivers support this
   */
  @Property()
  declare affected?: number;
  /**
   * Contains inserted entity id.
   * Has entity-like structure (not just column database name and values).
   */
  /**
   * Generated values returned by a database.
   * Has entity-like structure (not just column database name and values).
   */
  @CollectionOf(ObjectLiteralDto)
  declare generatedMaps: ObjectLiteralDto[];
}

export class DeleteResultDto extends DeleteResult {
  /**
   * Raw SQL result returned by executed query.
   */
  @Property()
  declare raw: any;
  /**
   * Number of affected rows/documents
   * Not all drivers support this
   */
  @Property()
  declare affected?: number | null;
}