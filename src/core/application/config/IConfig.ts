export interface IConfig {
  HOST: string;
  PORT: number;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  ACCESS_TOKEN_EXPIRES_IN: `${number}${"s" | "m" | "h" | "d" | "days"}` | number;
  REFRESH_TOKEN_EXPIRES_IN: `${number}${"s" | "m" | "h" | "d" | "y"}` | number;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
}
