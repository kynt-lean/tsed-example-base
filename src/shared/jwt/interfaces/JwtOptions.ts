import { SignOptions, VerifyOptions, Secret } from "jsonwebtoken";

export enum JwtSecretRequestType {
  SIGN,
  VERIFY
}

export type JwtConfigOptions = JwtSignOptions | JwtVerifyOptions;

export interface JwtOptions {
  signOptions?: SignOptions;
  verifyOptions?: VerifyOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: VerifyOptions | SignOptions
  ) => Secret;
}

export interface JwtSignOptions extends SignOptions {
  secret?: string | Buffer;
  privateKey?: string | Buffer;
  issuer?: string | undefined;
  audience?: string | undefined;
}

export interface JwtVerifyOptions extends VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  issuer?: string | undefined;
  audience?: string | undefined;
}