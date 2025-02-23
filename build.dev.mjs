import * as esbuild from 'esbuild'
import { spawn } from 'child_process'

let buildContext = await esbuild.context({
  entryPoints: [{
    in: './src/index.tsx', out: 'index'
  }, {
    in: './src/data/locale/en-us.json', out: 'locale/en-us'
  }],
  bundle: true,
  outdir: 'public/assets',
  tsconfig: 'tsconfig.json',
  sourcemap: true,
  external: ['./locale/*'],
  format: 'esm'
}).catch(() => process.exit(1))

await buildContext.watch()

let { hosts, port } = await buildContext.serve({
  servedir: 'public',
})

// @FIXME - hosts is hardcoded to the first
console.log(`Serving the app at ${hosts[0]}:${port}`)

const typecheck = spawn('npx',
  ['tsc', '--watch', '--pretty', '--noEmit', '--preserveWatchOutput'], {
  cwd: './src',
  stdio: 'pipe',
  shell: true,
})

typecheck.stdout.on('data', data => {
  console.log(`${data.toString()}`)
})
