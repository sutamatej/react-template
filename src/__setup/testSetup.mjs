import Module from 'module'

// ignore CSS file imports for tests
// oxlint-disable-next-line eslint/no-underscore-dangle
Module._extensions['.css'] = () => null
