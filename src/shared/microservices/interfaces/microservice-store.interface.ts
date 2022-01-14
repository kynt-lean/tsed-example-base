import { PatternType, Transport } from "../enums";
import { PatternMetadata } from "./pattern-metadata.interface";

export interface MsStoreOptions {
  type: PatternType;
  pattern?: PatternMetadata | string;
  transport?: Transport;
}

export interface MsStore {
  [msClass: string]: {[msMethod: string]: MsStoreOptions};
}