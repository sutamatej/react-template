import Module, { registerHooks } from 'module'

// ignore CSS file imports for tests
// oxlint-disable-next-line eslint/no-underscore-dangle
Module._extensions['.css'] = () => null

// Locale files are built from JSON into ./locale/*.js and only exist in the
// build output (see build.dev.mjs). Point those imports at the JSON sources so
// code loading them works in tests and test files can mock them.
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (/^\.\/locale\/[\w-]+\.js$/.test(specifier)) {
      return nextResolve(specifier.replace(/\.js$/, '.json'), context)
    }
    return nextResolve(specifier, context)
  },
})
