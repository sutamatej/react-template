/* oxlint-disable no-console no-magic-numbers */

import { context } from 'esbuild'
import { spawn } from 'child_process'

let buildContext = await context({
  bundle: true,
  entryPoints: [{
    in: './src/index.tsx', out: 'index'
  }, {
    in: './src/data/locale/en-us.json', out: 'locale/en-us'
  }],
  external: ['./locale/*'],
  format: 'esm',
  outdir: 'public/assets',
  sourcemap: true,
  tsconfig: 'tsconfig.json',
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
  shell: true,
  stdio: 'pipe',
})

typecheck.stdout.on('data', data => {
  console.log(`${data.toString()}`)
})
