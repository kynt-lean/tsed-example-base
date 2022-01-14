import { Constant, Injectable } from '@tsed/common';
import { decode, DecodeOptions, Secret, sign, SignOptions, verify, VerifyOptions } from 'jsonwebtoken';
import { JwtOptions, JwtSecretRequestType, JwtSignOptions, JwtVerifyOptions } from '../interfaces/jwt-options.interface';

@Injectable()
export class JwtService {
  @Constant('jwt')
  protected options: JwtOptions

  sign(payload: string | Buffer | object, options?: JwtSignOptions): string {
    const signOptions = this.mergeJwtOptions(
      { ...(options || this.options) },
      'signOptions'
    ) as SignOptions;
    const secret = this.getSecretKey(
      payload,
      options || this.options,
      'privateKey',
      JwtSecretRequestType.SIGN
    );

    return sign(payload, secret, signOptions);
  }

  verify<T extends object = any>(token: string, options?: JwtVerifyOptions): T {
    const verifyOptions = this.mergeJwtOptions({ ...options }, 'verifyOptions');
    const secret = this.getSecretKey(
      token,
      options || this.options,
      'publicKey',
      JwtSecretRequestType.VERIFY
    );

    return verify(token, secret, verifyOptions) as T;
  }

  decode(token: string, options?: DecodeOptions): null | { [key: string]: any } | string {
    return decode(token, options);
  }

  protected mergeJwtOptions(options: JwtVerifyOptions | JwtSignOptions, key: 'verifyOptions' | 'signOptions'): VerifyOptions | SignOptions {
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

  protected getSecretKey(token: string | object | Buffer, options: JwtVerifyOptions | JwtSignOptions, key: 'publicKey' | 'privateKey', secretRequestType: JwtSecretRequestType): string | Buffer | Secret {
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