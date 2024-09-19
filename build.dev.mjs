import * as esbuild from 'esbuild'
import { spawn } from 'child_process'

let buildContext = await esbuild.context({
  entryPoints: ['./src/index.tsx'],
  bundle: true,
  outdir: 'public/assets',
  tsconfig: 'tsconfig.json',
  sourcemap: true,
}).catch(() => process.exit(1))

await buildContext.watch()

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
