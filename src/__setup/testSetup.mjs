import { JSDOM } from 'jsdom'
import Module from 'module'

const dom = new JSDOM('<html><body></body></html>')
global.document = dom.window.document
global.window = dom.window
// global.navigator = dom.window.navigator

Object.defineProperty(global, 'navigator', {
  value: dom.window.navigator,
  writable: true,
})

// ignore CSS file imports for tests
Module._extensions['.css'] = () => null
