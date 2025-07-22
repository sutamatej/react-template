import { readFileSync, writeFileSync } from 'node:fs'
import { createInterface } from 'node:readline/promises'

const PACKAGE_JSON_SPACE_SIZE = 2;

function readPackageJson() {
  const content = readFileSync('package.json', 'utf8')
  return JSON.parse(content)
}

function updatePackageJson(packageJson, { name, version, description, main, author, license }) {
  packageJson.name = name || packageJson.name
  packageJson.version = version || packageJson.version
  packageJson.description = description || packageJson.description
  packageJson.main = main || packageJson.main
  packageJson.author = author || packageJson.author
  packageJson.license = license || packageJson.license
  writeFileSync('package.json', JSON.stringify(packageJson, null, PACKAGE_JSON_SPACE_SIZE))
}

function updateBuildScripts({ main }) {
  if (!main) {
    return
  }

  const content = readFileSync('build.dev.mjs', 'utf8')
  // TODO this is not working all that well because package.json contains
  // index.js so we have to strip the .js suffix or something
  const updated = content.replace(/'index'/g, `'${main}'`)
  writeFileSync('build.dev.mjs', updated)
}

function updateIndexHtml({ name, main }) {
  // TODO this is not great, we need to treat main and name individually
  if (!main && !name) {
    return
  }

  const content = readFileSync('public/index.html', 'utf8')
  let updated = content.replace(/index\.css/g, `${main}.css`)
  updated = updated.replace(/index\.js/g, `${main}.js`)
  updated = updated.replace(/React Template App/g, `${name}`)
  writeFileSync('public/index.html', updated)
}

async function populateCustomization(packageJson) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const name = await rl.question(`Package name: (${packageJson.name}) `)
  const version = await rl.question(`Package version: (${packageJson.version}) `)
  const description = await rl.question(`Package description: (${packageJson.description}) `)
  const main = await rl.question(`Package main file name: (${packageJson.main}) `)
  const author = await rl.question(`Package author: (${packageJson.author}) `)
  const license = await rl.question(`Package license: (${packageJson.license}) `)
  rl.close()

  return {
    author,
    description,
    license,
    main,
    name,
    version,
  }
}

async function customize() {
  const packageJson = readPackageJson()
  const data = await populateCustomization(packageJson)
  updatePackageJson(packageJson, data)
  updateBuildScripts(data)
  updateIndexHtml(data)
}

await customize()
