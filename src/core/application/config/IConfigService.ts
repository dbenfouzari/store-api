import type { IConfig } from "@application/config/IConfig";

export interface IConfigService {
  get<T extends keyof IConfig>(key: T): IConfig[T];
}
