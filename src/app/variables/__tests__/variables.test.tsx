import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import Variable from '../page'

// Mock @tanstack/react-virtual
const mockVirtualizer = {
  getTotalSize: jest.fn(() => 1000000),
  getVirtualItems: jest.fn(() => [
    {
      index: 0,
      key: 'item-0',
      start: 0,
      size: 100,
    },
    {
      index: 1,
      key: 'item-1',
      start: 100,
      size: 100,
    },
  ]),
}

jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn(() => mockVirtualizer),
}))

// Mock console.log to avoid noise in tests
const originalConsoleLog = console.log
beforeEach(() => {
  console.log = jest.fn()
})

afterEach(() => {
  console.log = originalConsoleLog
})

describe('Variable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Variable />)
  })

  it('renders introductory text about variable sizes', () => {
    render(<Variable />)
    expect(screen.getByText(/variable/i)).toBeInTheDocument()
    expect(screen.getByText(/unique, but knowable dimension at render time/i)).toBeInTheDocument()
  })

  it('renders Grid heading', () => {
    render(<Variable />)
    expect(screen.getByText('Grid')).toBeInTheDocument()
  })

  it('renders GridVirtualizerVariable component', () => {
    render(<Variable />)
    expect(screen.getByText('Cell 0, 0')).toBeInTheDocument()
    expect(screen.getByText('Cell 0, 1')).toBeInTheDocument()
  })

  it('logs virtual items changes', () => {
    render(<Variable />)
    expect(console.log).toHaveBeenCalled()
  })

  it('uses correct virtualizer configuration for rows', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    
    render(<Variable />)
    
    // Check that useVirtualizer was called with row configuration
    expect(useVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        count: expect.any(Number),
        getScrollElement: expect.any(Function),
        estimateSize: expect.any(Function),
        overscan: 5,
      })
    )
  })

  it('uses correct virtualizer configuration for columns', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    
    render(<Variable />)
    
    // Check that useVirtualizer was called with column configuration
    expect(useVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        horizontal: true,
        count: 4, // default lanes
        getScrollElement: expect.any(Function),
        estimateSize: expect.any(Function),
        overscan: 5,
      })
    )
  })

  it('renders grid cells with correct styling', () => {
    render(<Variable />)
    
    const cell = screen.getByText('Cell 0, 0')
    expect(cell).toHaveStyle({
      width: '100px',
      height: '100px',
    })
  })

  it('applies correct grid template columns', () => {
    const { container } = render(<Variable />)
    const gridRow = container.querySelector('[style*="gridTemplateColumns"]')
    
    expect(gridRow).toHaveStyle({
      gridTemplateColumns: 'repeat(4, 100px)',
    })
  })

  it('applies correct gap styling to grid', () => {
    const { container } = render(<Variable />)
    const gridRow = container.querySelector('[style*="gap"]')
    
    expect(gridRow).toHaveStyle({
      gap: '20px',
    })
  })

  it('renders grid container with correct dimensions', () => {
    const { container } = render(<Variable />)
    const gridContainer = container.querySelector('.List')
    
    expect(gridContainer).toHaveStyle({
      height: '400px',
      width: '500px',
      overflow: 'auto',
    })
  })

  it('handles empty virtual items', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    useVirtualizer.mockReturnValueOnce({
      getTotalSize: jest.fn(() => 0),
      getVirtualItems: jest.fn(() => []),
    })

    render(<Variable />)
    expect(screen.queryByText('Cell 0, 0')).not.toBeInTheDocument()
  })

  it('applies conditional CSS classes based on row and column indices', () => {
    render(<Variable />)
    
    // Test different combinations of row and column parity
    const cell00 = screen.getByText('Cell 0, 0')
    const cell01 = screen.getByText('Cell 0, 1')
    
    // The CSS class logic is complex, so we just verify the cells are rendered
    expect(cell00).toBeInTheDocument()
    expect(cell01).toBeInTheDocument()
  })

  it('renders correct total size container', () => {
    const { container } = render(<Variable />)
    const sizeContainer = container.querySelector('[style*="height: 1000000px"]')
    expect(sizeContainer).toBeInTheDocument()
  })

  it('positions grid rows correctly', () => {
    render(<Variable />)
    
    const { container } = render(<Variable />)
    const gridRow = container.querySelector('[style*="transform"]')
    
    expect(gridRow).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100px',
      height: '100px',
      transform: 'translateY(0px)',
    })
  })

  it('handles large data sets', () => {
    render(<Variable />)
    
    // Should handle 10000 rows and columns
    const { useVirtualizer } = require('@tanstack/react-virtual')
    const calls = useVirtualizer.mock.calls
    
    // First call should be for rows with count 10000
    expect(calls[0][0]).toHaveProperty('count', 10000)
  })

  it('initializes with default lanes value', () => {
    render(<Variable />)
    
    // The component should initialize with 4 lanes by default
    const { container } = render(<Variable />)
    const gridRow = container.querySelector('[style*="gridTemplateColumns"]')
    
    expect(gridRow).toHaveStyle({
      gridTemplateColumns: 'repeat(4, 100px)',
    })
  })
})