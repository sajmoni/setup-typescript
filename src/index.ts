#!/usr/bin/env node

import writePrettyFile from 'write-pretty-file'
import { execa } from 'execa'
import chalk from 'chalk'
import { readPackage } from 'read-pkg'
import sortPackageJson from 'sort-package-json'
import { writePackage } from 'write-package'
import tsConfig from './tsConfigTemplate.js'

console.log()
console.log(chalk.blue.bold(' setup-typescript'))
console.log()

try {
  await execa('npm', ['install', 'typescript', 'tsconfig-one', '--save-dev'])

  await writePrettyFile('tsconfig.json', tsConfig)

  const packageJson = await readPackage({
    normalize: false,
  })

  const updatedPackageJson = sortPackageJson({
    ...packageJson,
    scripts: packageJson.scripts
      ? {
          ...packageJson.scripts,
          build: 'tsc',
        }
      : {
          build: 'tsc',
        },
  })

  // @ts-expect-error - sort-package-json doesn't return a compatible type
  await writePackage(updatedPackageJson)

  console.log(` ${chalk.green('typescript and tsconfig.json added!')}`)
} catch (error) {
  console.log(chalk.red('setup-typescript: Failed to setup typescript'))
  throw error
}
