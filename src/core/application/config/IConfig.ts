export interface IConfig {
  HOST: string;
  PORT: number;
  JWT_SECRET: string;
  JWT_EXPIRES_IN: `${number}${"s" | "m" | "h" | "d" | "days"}` | number;
  JWT_ISSUER: string;
  JWT_AUDIENCE: string;
}
