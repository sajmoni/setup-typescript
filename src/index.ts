#!/usr/bin/env node

import { writeFile } from "node:fs/promises";
import { execa } from "execa";
import chalk from "chalk";
import { readPackage } from "read-pkg";
import sortPackageJson from "sort-package-json";
import { writePackage } from "write-pkg";
import tsConfig from "./tsConfigTemplate.js";

console.log();
console.log(chalk.blue.bold(" setup-typescript"));
console.log();

try {
  await execa("npm", [
    "install",
    "typescript@5.1.0-dev.20230305",
    "tsconfig-one@0.0.3",
    "--save-dev",
  ]);

  await writeFile("tsconfig.json", JSON.stringify(tsConfig));

  const packageJson = await readPackage({
    normalize: false,
  });

  const updatedPackageJson = sortPackageJson({
    ...packageJson,
    scripts: packageJson.scripts
      ? {
          ...packageJson.scripts,
          build: "tsc",
        }
      : {
          build: "tsc",
        },
  });

  // @ts-expect-error - sort-package-json doesn't return a compatible type
  await writePackage(updatedPackageJson);

  console.log(` ${chalk.green("typescript and tsconfig.json added!")}`);
} catch (error) {
  console.log(chalk.red("setup-typescript: Failed to setup typescript"));
}
