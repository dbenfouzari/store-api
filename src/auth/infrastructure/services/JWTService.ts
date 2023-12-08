import type { IJWTService, TokenPayload } from "@auth/application/services/IJWTService";

import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { TokenType } from "@auth/application/services/IJWTService";
import { DI_TOKENS } from "@infrastructure/di/tokens";
import { Option } from "@shared/common/Option";

@injectable()
export class JWTService implements IJWTService {
  constructor(
    @inject(DI_TOKENS.ConfigService) private readonly _configService: IConfigService
  ) {}

  sign(payload: TokenPayload, type: TokenType): string {
    const secret =
      type === TokenType.AccessToken
        ? this._configService.get("ACCESS_TOKEN_SECRET")
        : this._configService.get("REFRESH_TOKEN_SECRET");

    const expiresIn =
      type === TokenType.AccessToken
        ? this._configService.get("ACCESS_TOKEN_EXPIRES_IN")
        : this._configService.get("REFRESH_TOKEN_EXPIRES_IN");

    return jwt.sign(payload, secret, {
      expiresIn: expiresIn,
      audience: this._configService.get("JWT_AUDIENCE"),
      issuer: this._configService.get("JWT_ISSUER"),
    });
  }

  verify(token: string, type: TokenType): Option<TokenPayload> {
    const secret =
      type === TokenType.AccessToken
        ? this._configService.get("ACCESS_TOKEN_SECRET")
        : this._configService.get("REFRESH_TOKEN_SECRET");

    try {
      return Option.some(
        jwt.verify(token, secret, {
          audience: this._configService.get("JWT_AUDIENCE"),
          issuer: this._configService.get("JWT_ISSUER"),
        }) as TokenPayload
      );
    } catch (error) {
      return Option.none();
    }
  }
}
