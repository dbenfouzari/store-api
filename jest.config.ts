import type { Config } from "jest";

import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  transform: {
    "^.+\\.tsx?$": "@swc/jest",
  },
  testEnvironment: "node",
  passWithNoTests: true,
  moduleNameMapper: compilerOptions.paths
    ? Object.entries(compilerOptions.paths).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [`^${key.replace("/*", "/(.*)")}$`]: `<rootDir>/${value[0].replace(
            "/*",
            "/$1"
          )}`,
        }),
        {}
      )
    : undefined,
};

export default config;
