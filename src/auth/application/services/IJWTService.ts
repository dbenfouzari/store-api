import type { Option } from "@shared/common/Option";
import type { JwtPayload } from "jsonwebtoken";

export enum TokenType {
  AccessToken = "ACCESS_TOKEN",
  RefreshToken = "REFRESH_TOKEN",
}

export type TokenPayload = JwtPayload & {
  sub: string;
  email: string;
};

export interface IJWTService {
  sign(payload: TokenPayload, type: TokenType): string;
  verify(token: string, type: TokenType): Option<TokenPayload>;
}
