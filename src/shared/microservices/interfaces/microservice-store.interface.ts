import { PatternType, Transport } from "../enums";
import { PatternMetadata } from "./pattern-metadata.interface";

export interface MicroserviceStoreOptions {
  type: PatternType;
  pattern?: PatternMetadata | string;
  transport?: Transport;
}

export interface MicroserviceStore {
  [msClass: string]: {[msMethod: string]: MicroserviceStoreOptions};
}