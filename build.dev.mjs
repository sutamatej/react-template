/* oxlint-disable no-console no-magic-numbers */

import { context } from 'esbuild'
import { spawn } from 'child_process'

const buildContext = await context({
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

const { hosts, port } = await buildContext.serve({
  servedir: 'public',
})

console.log('Serving the app at:')
for (const host of hosts) {
  // IPv6 addresses need brackets in URLs
  console.log(`  http://${host.includes(':') ? `[${host}]` : host}:${port}/`)
}

spawn('npx',
  ['tsc', '--watch', '--pretty', '--preserveWatchOutput'], {
  cwd: './src',
  shell: true,
  stdio: 'inherit',
})
