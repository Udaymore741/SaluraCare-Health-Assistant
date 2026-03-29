import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock scrollIntoView for tests (not available in jsdom)
Element.prototype.scrollIntoView = function() {}

// Cleanup after each test case
afterEach(() => {
  cleanup()
})
