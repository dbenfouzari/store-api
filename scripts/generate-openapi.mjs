#!/usr/bin/env node
// noinspection JSIgnoredPromiseFromCall

import fetch from "node-fetch";
import * as fs from "fs";
import minimist from "minimist";
import { waitForHost } from "./utils/wait-for-host.mjs";
import { ensureDirectoryExistence } from "./utils/ensure-directory-existence.mjs";
import YAML from "yaml";

async function main() {
  const { json, yaml, yml, output } = minimist(process.argv.slice(2));

  const format = json ? "json" : yaml || yml ? "yaml" : "json";
  const outputPath = output || `docs/openapi.${format}`;

  console.log(`Generating OpenAPI ${format} at ${outputPath}`);

  const url = `http://localhost:4000/api/v1/api-docs-${format}`;

  console.log(`Checking if server is up at ${url}`);

  const fetchOptions = {
    method: "GET",
    headers: {
      "Content-Type": format === "json" ? "application/json" : "x-application/yaml"
    }
  }

  try {
    await waitForHost(url);
    console.log("Server is up");

    fetch(url, fetchOptions).then(
      async (data) => {
        if (format === "json") {
          const resJson = await data.json();
          const json = JSON.stringify(resJson, null, 2);
          ensureDirectoryExistence(outputPath);
          fs.writeFileSync(outputPath, json, "utf8");
        } else {
          const resYaml = await data.text();
          const doc = YAML.stringify(YAML.parse(resYaml));
          ensureDirectoryExistence(outputPath);
          fs.writeFileSync(outputPath, doc, "utf8");
        }
      }
    )
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

main();
