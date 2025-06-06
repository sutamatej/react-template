import * as TSNode from 'ts-node'
import Module from 'module'

TSNode.register({
  project: './tsconfig.json',
  files: true
})

// ignore CSS file imports for tests
Module._extensions['.css'] = () => undefined
