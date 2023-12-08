import type { IJWTService } from "@auth/application/services/IJWTService";

import jwt from "jsonwebtoken";
import { inject, injectable } from "tsyringe";

import { IConfigService } from "@application/config/IConfigService";
import { DI_TOKENS } from "@infrastructure/di/tokens";
import { Option } from "@shared/common/Option";

type Payload = Record<string, unknown>;

@injectable()
export class JWTService implements IJWTService<Payload> {
  constructor(
    @inject(DI_TOKENS.ConfigService) private readonly _configService: IConfigService
  ) {}

  sign(payload: Payload): string {
    return jwt.sign(payload, this._configService.get("JWT_SECRET"), {
      expiresIn: this._configService.get("JWT_EXPIRES_IN"),
      audience: this._configService.get("JWT_AUDIENCE"),
      issuer: this._configService.get("JWT_ISSUER"),
    });
  }

  verify(token: string): Option<Payload> {
    try {
      return Option.some(
        jwt.verify(token, this._configService.get("JWT_SECRET"), {
          audience: this._configService.get("JWT_AUDIENCE"),
          issuer: this._configService.get("JWT_ISSUER"),
        }) as Payload
      );
    } catch (error) {
      return Option.none();
    }
  }
}
