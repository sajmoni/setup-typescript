import path from 'node:path'
import { expect, test } from 'vitest'
import { execa } from 'execa'
import { temporaryDirectory } from 'tempy'
import { loadJsonFile } from 'load-json-file'
import { PackageJson, readPackage } from 'read-pkg'
import { getBinPath } from 'get-bin-path'

import tsConfig from './src/tsConfigTemplate'

test('setup-typescript', async () => {
  const binPath = await getBinPath()
  if (!binPath) {
    throw new Error('Bin path not found')
  }
  const directory = temporaryDirectory({ prefix: 'hello-world' })

  const { stdout } = await execa(binPath, [], {
    cwd: directory,
    env: {
      // @ts-expect-error
      FORCE_COLOR: 2,
    },
  })

  const generatedTsConfig = await loadJsonFile(
    path.join(directory, 'tsconfig.json'),
  )

  expect(generatedTsConfig).toEqual(tsConfig)

  const packageJson = (await readPackage({
    cwd: directory,
    normalize: false,
  })) as PackageJson & {
    devDependencies: Record<string, string>
  }

  expect(Object.keys(packageJson.devDependencies)).toEqual([
    'tsconfig-one',
    'typescript',
  ])

  console.log('stdout', stdout)
  expect(stdout).toMatchSnapshot()
})
