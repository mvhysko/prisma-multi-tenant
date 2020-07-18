const fs = require('fs')
const path = require('path')
const { exec } = require('child_process')

const packages = ['shared', 'client', 'cli', 'nexus']

const docs = ['doc-basic-js', 'doc-basic-ts']

const cwd = {
  root: path.join(__dirname, '../'),
  shared: path.join(__dirname, '../packages/shared'),
  client: path.join(__dirname, '../packages/client'),
  cli: path.join(__dirname, '../packages/cli'),
  nexus: path.join(__dirname, '../packages/nexus'),
  'doc-basic-js': path.join(__dirname, '../docs/examples/basic-js'),
  'doc-basic-ts': path.join(__dirname, '../docs/examples/basic-ts'),
}

const updatePackageJson = async (name, versionNumber, dryRun) => {
  console.log(`\n€ ${name} > update package.json`)

  const packageJsonPath = path.join(cwd[name], `package.json`)

  const packageJson = JSON.parse(await fs.promises.readFile(packageJsonPath))

  packageJson.version = versionNumber

  if (!dryRun) {
    if (packageJson.dependencies && packageJson.dependencies['@prisma-multi-tenant/shared']) {
      packageJson.dependencies['@prisma-multi-tenant/shared'] = `^${versionNumber}`
    }
    if (packageJson.dependencies && packageJson.dependencies['@prisma-multi-tenant/client']) {
      packageJson.dependencies['@prisma-multi-tenant/client'] = `^${versionNumber}`
    }
  }

  await fs.promises.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8')
}

const run = (name, cmd) => {
  console.log(`\n$ ${name} > ${cmd}`)

  return new Promise((resolve, reject) =>
    exec(
      cmd,
      {
        cwd: cwd[name],
        env: process.env,
      },
      (error, stdout, stderr) => {
        if (error) {
          console.log(stderr)
          reject(error)
        }
        resolve(stdout)
      }
    )
  )
}

module.exports = {
  packages,
  docs,
  cwd,
  updatePackageJson,
  run,
}