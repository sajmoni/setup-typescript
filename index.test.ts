import path from "node:path";
import { readFile } from "node:fs/promises";
import { expect, test } from "vitest";
import { execa } from "execa";
import { temporaryDirectory } from "tempy";
import { PackageJson, readPackage } from "read-pkg";
import tsConfig from "./src/tsConfigTemplate";

test("add-typescript", async () => {
  const directory = temporaryDirectory({ prefix: "hello-world" });

  const { stdout } = await execa("add-typescript", [], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  });

  const generatedTsConfig = await readFile(
    path.join(directory, "tsconfig.json")
  );

  expect(generatedTsConfig).toEqual(tsConfig);

  const packageJson = (await readPackage({
    cwd: directory,
    normalize: false,
  })) as PackageJson & {
    devDependencies: Record<string, string>;
  };

  expect(Object.keys(packageJson.devDependencies)).toEqual([
    "typescript",
    "ts-config-one",
  ]);

  console.log("stdout", stdout);
  expect(stdout).toMatchSnapshot();
});
