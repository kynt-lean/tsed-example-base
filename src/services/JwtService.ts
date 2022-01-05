import { Inject, Injectable, registerProvider } from '@tsed/common';
import * as jwt from 'jsonwebtoken';
import { jwtOptions } from '../config/jwt/jwt.config';

export const JWT_MODULE_OPTIONS = Symbol.for("JWT_MODULE_OPTIONS");
export type JWT_MODULE_OPTIONS = JwtOptions;

registerProvider({
  provide: JWT_MODULE_OPTIONS,
  useValue: jwtOptions
});

export enum JwtSecretRequestType {
  SIGN,
  VERIFY
}

export interface JwtOptions {
  signOptions?: jwt.SignOptions;
  verifyOptions?: jwt.VerifyOptions;
  secret?: string | Buffer;
  publicKey?: string | Buffer;
  privateKey?: jwt.Secret;
  secretOrKeyProvider?: (
    requestType: JwtSecretRequestType,
    tokenOrPayload: string | object | Buffer,
    options?: jwt.VerifyOptions | jwt.SignOptions
  ) => jwt.Secret;
}

export interface JwtSignOptions extends jwt.SignOptions {
  secret?: string | Buffer;
  privateKey?: string | Buffer;
}

export interface JwtVerifyOptions extends jwt.VerifyOptions {
  secret?: string | Buffer;
  publicKey?: string | Buffer;
}

@Injectable()
export class JwtService {
  constructor(
    @Inject(JWT_MODULE_OPTIONS) private readonly options: JwtOptions
  ) {}

  sign(payload: string | Buffer | object, options?: JwtSignOptions): string {
    const signOptions = this.mergeJwtOptions(
      { ...(options || jwtOptions) },
      'signOptions'
    ) as jwt.SignOptions;
    const secret = this.getSecretKey(
      payload,
      options || jwtOptions,
      'privateKey',
      JwtSecretRequestType.SIGN
    );

    return jwt.sign(payload, secret, signOptions);
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const verifyOptions = this.mergeJwtOptions({ ...options }, 'verifyOptions');
    const secret = this.getSecretKey(
      token,
      options || jwtOptions,
      'publicKey',
      JwtSecretRequestType.VERIFY
    );

    return jwt.verify(token, secret, verifyOptions) as T;
  }

  decode(token: string, options?: jwt.DecodeOptions): null | { [key: string]: any } | string {
    return jwt.decode(token, options);
  }

  private mergeJwtOptions(options: JwtVerifyOptions | JwtSignOptions, key: 'verifyOptions' | 'signOptions'): jwt.VerifyOptions | jwt.SignOptions {
    delete options.secret;
    if (key === 'signOptions') {
      delete (options as JwtSignOptions).privateKey;
    } else {
      delete (options as JwtVerifyOptions).publicKey;
    }

    return {
      ...(this.options[key] || {}),
      ...options
    };
  }

  private getSecretKey(token: string | object | Buffer, options: JwtVerifyOptions | JwtSignOptions, key: 'publicKey' | 'privateKey', secretRequestType: JwtSecretRequestType): string | Buffer | jwt.Secret {
    let secret = this.options.secretOrKeyProvider
      ? this.options.secretOrKeyProvider(secretRequestType, token, options)
      : options?.secret ||
        this.options.secret ||
        (key === 'privateKey'
          ? (options as JwtSignOptions)?.privateKey || this.options.privateKey
          : (options as JwtVerifyOptions)?.publicKey || this.options.publicKey) || this.options[key];

    return secret || "";
  }
}