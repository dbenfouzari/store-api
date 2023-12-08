import type { IConfig } from "@application/config/IConfig";
import type { IConfigService } from "@application/config/IConfigService";

import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

export class ConfigService implements IConfigService {
  private envSchema = z.object({
    TZ: z.string().default("UTC"),
    PORT: z.coerce.number().default(4000),
    HOST: z.string().default("http://localhost"),
    JWT_SECRET: z.string(),
    JWT_EXPIRES_IN: z.string().default("1h") as z.ZodType<
      "1s" | "1m" | "1h" | "1d" | "1days"
    >,
    JWT_ISSUER: z.string().default("Store API"),
    JWT_AUDIENCE: z.string().default("Store API"),
  });

  private config: IConfig = this.envSchema.parse(process.env);

  constructor() {
    this.envSchema.parse(process.env);
  }

  get<T extends keyof IConfig>(key: T): IConfig[T] {
    return this.config[key];
  }
}
