#!/usr/bin/env node

import { execa } from "execa";
import chalk from "chalk";

console.log();
console.log(chalk.blue.bold(" npm-init-ex"));
console.log();

await execa("npm", ["install", "typescript", "tsconfig-one", "--save-dev"]);

// Create tsconfig.json
// If tsconfig already exists, it will be overwritten

console.log(` ${chalk.green("typescript and tsconfig.json added!")}`);
