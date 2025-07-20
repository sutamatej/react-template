import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs'
import { z } from 'zod'

const Leaf = z.strictObject({
  comment: z.string(),
  text:    z.string(),
})

const Tree = z.lazy(() => z.record(z.string(), z.union([Leaf, Tree])))

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const EXIT_SUCCESS = 0
const EXIT_ERROR = 1

function validate() {
  const filename = join(__dirname, 'en-us.json')
  const file = readFileSync(filename, 'utf8')
  const json = JSON.parse(file)
  const result = Tree.safeParse(json)
  if (!result.success) {
    /* oxlint-disable no-console */
    console.error(`${filename} validation error:`)
    console.error(z.prettifyError(result.error))
    /* oxlint-enable no-console */
    process.exit(EXIT_ERROR)
  }
  process.exit(EXIT_SUCCESS)
}

validate()
