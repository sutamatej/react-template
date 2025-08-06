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
  const updated = content.replace(/'index'/g, `'${main}'`)
  writeFileSync('build.dev.mjs', updated)
}

function updateIndexHtml({ name, main }) {
  if (!main && !name) {
    return
  }

  let fileContent = readFileSync('public/index.html', 'utf8')
  if (main) {
    fileContent = fileContent.replace(/index\.css/g, `${main}.css`)
    fileContent = fileContent.replace(/index\.js/g, `${main}.js`)
  }

  if (name) {
    fileContent = fileContent.replace(/React Template App/g, `${name}`)
  }

  writeFileSync('public/index.html', fileContent)
}

function removeSuffixes(input, suffixes) {
  return suffixes.reduce((result, suffix) => {
    const suffixIndex = result.indexOf(suffix)
    if (suffixIndex !== -1) {
      return result.substring(0, suffixIndex)
    }
    return result
  }, input)
}

async function populateCustomization(packageJson) {
  const rl = createInterface({ input: process.stdin, output: process.stdout })
  const name = await rl.question(`Package name: (${packageJson.name}) `)
  const version = await rl.question(`Package version: (${packageJson.version}) `)
  const description = await rl.question(`Package description: (${packageJson.description}) `)
  const mainWithSuffix = await rl.question(`Package main file name: (${packageJson.main}) `)
  const author = await rl.question(`Package author: (${packageJson.author}) `)
  const license = await rl.question(`Package license: (${packageJson.license}) `)
  rl.close()

  return {
    author,
    description,
    license,
    main: removeSuffixes(mainWithSuffix, ['.js', '.jsx', '.ts', '.tsx']),
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
