/* eslint-disable @typescript-eslint/no-var-requires */

const preferUseLoggers = require("./rules/preferUseLogger");

module.exports = {
  rules: {
    "prefer-use-logger": preferUseLoggers,
  },
  configs: {
    recommended: {
      plugins: ["eslint-plugin-store"],
      rules: {
        "eslint-plugin-store/prefer-use-logger": "error",
      },
    },
  },
};
