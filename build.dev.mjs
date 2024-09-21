import * as esbuild from 'esbuild'
import { spawn } from 'child_process'
import { promises as fs } from 'fs'
import path from 'path'

const config = {
  localeSourcePath: './src/data/locale',
  localeDestinationPath: './public/assets/locale',
}

async function canAccessLocaleDir() {
  try {
    await fs.access(config.localeDestinationPath)
    return true
  } catch (error) {
    console.warn('Error accessing locale directory', error)
    return false
  }
}

async function copyTranslations() {
  try {
    const files = await fs.readdir(config.localeSourcePath)
    const destExists = await canAccessLocaleDir()
    if (!destExists) {
      await fs.mkdir(config.localeDestinationPath, { recursive: true })
    }

    for (const file of files) {
      await fs.copyFile(
        path.join(config.localeSourcePath, file),
        path.join(config.localeDestinationPath, file),
      )
    }
  } catch (err) {
    console.error('Error copying translations:', err)
  }
}

async function watchLocaleChanges() {
  try {
    const watcher = fs.watch(config.localeSourcePath)
    for await (const event of watcher) {
      await copyTranslations()
    }
  } catch (err) {
    console.error('Error watching locale source directory', err)
  }
}

let buildContext = await esbuild.context({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outdir: 'public/assets',
  tsconfig: 'tsconfig.json',
  sourcemap: true,
  external: ['*.json'],
}).catch(() => process.exit(1))

await buildContext.watch()

await copyTranslations()

let { host, port } = await buildContext.serve({
  servedir: 'public',
})

console.log(`Serving the app at ${host}:${port}`)

const typecheck = spawn('npx',
  ['tsc', '--watch', '--pretty', '--noEmit', '--preserveWatchOutput'], {
  cwd: './src',
  stdio: 'pipe',
  shell: true,
})

typecheck.stdout.on('data', data => {
  console.log(`${data.toString()}`)
})

void watchLocaleChanges()
