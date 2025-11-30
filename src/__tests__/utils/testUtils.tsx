import React from 'react'

// Mock IntersectionObserver for all tests
export const mockIntersectionObserver = () => {
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
}

// Mock ResizeObserver for all tests
export const mockResizeObserver = () => {
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  }
}

// Mock window.scrollTo
export const mockWindowScroll = () => {
  Object.defineProperty(window, 'scrollTo', {
    value: jest.fn(),
    writable: true,
  })
}

// Mock window.scrollY
export const mockWindowScrollY = () => {
  Object.defineProperty(window, 'scrollY', {
    value: 0,
    writable: true,
  })
}

// Mock getBoundingClientRect
export const mockBoundingClientRect = () => {
  Element.prototype.getBoundingClientRect = jest.fn(() => ({
    width: 100,
    height: 100,
    top: 0,
    left: 0,
    bottom: 100,
    right: 100,
    x: 0,
    y: 0,
    toJSON: jest.fn(),
  }))
}

// Setup all common mocks
export const setupCommonMocks = () => {
  mockIntersectionObserver()
  mockResizeObserver()
  mockWindowScroll()
  mockWindowScrollY()
  mockBoundingClientRect()
}

// Mock TanStack Virtual with default configuration
export const mockUseVirtualizer = (items: any[] = []) => {
  return {
    getTotalSize: jest.fn(() => 1000000),
    getVirtualItems: jest.fn(() => items),
    scrollToIndex: jest.fn(),
    measureElement: jest.fn(),
  }
}

// Mock TanStack Window Virtualizer with default configuration
export const mockUseWindowVirtualizer = (items: any[] = []) => {
  return {
    getTotalSize: jest.fn(() => 1000000),
    getVirtualItems: jest.fn(() => items),
    scrollToIndex: jest.fn(),
    measureElement: jest.fn(),
    options: {
      scrollMargin: 0,
    },
  }
}

// Default virtual item
export const createVirtualItem = (index: number, start: number = index * 100, size: number = 100) => ({
  index,
  key: `item-${index}`,
  start,
  size,
})

// Create multiple virtual items
export const createVirtualItems = (count: number, startIndex: number = 0) => {
  return Array.from({ length: count }, (_, i) => 
    createVirtualItem(startIndex + i)
  )
}

// Mock faker data
export const mockFakerData = {
  sentence: 'Lorem ipsum dolor sit amet',
  number: { min: 20, max: 70 },
}

// Mock React hooks
export const mockUseRef = (initialValue: any = null) => ({
  current: initialValue,
})

export const mockUseState = (initialValue: any) => [initialValue, jest.fn()]

export const mockUseEffect = () => jest.fn()

// Common test props
export const commonTestProps = {
  lanes: 4,
  count: 10000,
  estimateSize: () => 100,
  overscan: 5,
}

// CSS class names used in components
export const cssClasses = {
  listItemEven: 'ListItemEven',
  listItemOdd: 'ListItemOdd',
  list: 'List',
}

// Common test selectors
export const testSelectors = {
  virtualItem: '[data-index]',
  container: '.List',
  gridContainer: '[style*="position: relative"]',
}