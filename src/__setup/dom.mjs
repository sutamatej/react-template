// DOM environment for UI tests - import it first in every test file that
// renders components, before @testing-library/react or anything using the DOM
import './domGlobals.mjs'
import { afterEach } from 'node:test'
import { cleanup } from '@testing-library/react'

// Testing Library only cleans up automatically when a global afterEach exists,
// which node:test doesn't provide
afterEach(() => cleanup())
