import Module from 'module'
import { register } from 'ts-node'

register({
  files: true,
  project: './tsconfig.json',
})

// ignore CSS file imports for tests
Module._extensions['.css'] = () => null
