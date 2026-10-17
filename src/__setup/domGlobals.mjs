// Browser globals backed by jsdom. Kept separate from dom.mjs so they're set
// before @testing-library/react is evaluated (it reads document on import).
import { JSDOM } from 'jsdom'

const dom = new JSDOM('<html><body></body></html>')
global.document = dom.window.document
global.window = dom.window

Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
})
