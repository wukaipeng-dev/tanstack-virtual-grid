import React from 'react'
import { render, screen } from '@testing-library/react'
import Window from '../page'

// Mock @tanstack/react-virtual
jest.mock('@tanstack/react-virtual', () => ({
  useWindowVirtualizer: jest.fn(() => ({
    getTotalSize: jest.fn(() => 350000),
    getVirtualItems: jest.fn(() => [
      {
        index: 0,
        key: 'item-0',
        start: 0,
        size: 35,
      },
      {
        index: 1,
        key: 'item-1',
        start: 35,
        size: 35,
      },
      {
        index: 2,
        key: 'item-2',
        start: 70,
        size: 35,
      },
    ]),
    options: {
      scrollMargin: 0,
    },
  })),
}))

describe('Window Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Window />)
  })

  it('renders introductory text about scrollMargin', () => {
    render(<Window />)
    expect(screen.getByText(/scrollMargin/i)).toBeInTheDocument()
    expect(screen.getByText(/space or gap between the start of the page and the edges of the list/i)).toBeInTheDocument()
  })

  it('renders Window scroller heading', () => {
    render(<Window />)
    expect(screen.getByText('Window scroller')).toBeInTheDocument()
  })

  it('renders virtualized rows', () => {
    render(<Window />)
    expect(screen.getByText('Row 0')).toBeInTheDocument()
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2')).toBeInTheDocument()
  })

  it('applies correct CSS classes based on row index', () => {
    render(<Window />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0).toHaveClass('ListItemEven')
    
    const row1 = screen.getByText('Row 1')
    expect(row1).toHaveClass('ListItemOdd')
  })

  it('renders development notice in development mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    render(<Window />)
    expect(screen.getByText(/Notice:/i)).toBeInTheDocument()
    expect(screen.getByText(/React in development mode/i)).toBeInTheDocument()
    
    process.env.NODE_ENV = originalEnv
  })

  it('does not render development notice in production mode', () => {
    const originalEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'production'
    
    render(<Window />)
    expect(screen.queryByText(/Notice:/i)).not.toBeInTheDocument()
    
    process.env.NODE_ENV = originalEnv
  })

  it('applies correct transform styles to virtual items', () => {
    render(<Window />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      height: '35px',
      transform: 'translateY(0px)',
    })
    
    const row1 = screen.getByText('Row 1')
    expect(row1).toHaveStyle({
      transform: 'translateY(35px)',
    })
  })

  it('uses correct virtualizer configuration', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    
    render(<Window />)
    
    expect(useWindowVirtualizer).toHaveBeenCalledWith({
      count: 10000,
      estimateSize: expect.any(Function),
      overscan: 5,
      scrollMargin: 0,
    })
  })

  it('handles scrollMargin calculation when ref is null', () => {
    render(<Window />)
    
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    expect(useWindowVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        scrollMargin: 0,
      })
    )
  })

  it('renders container with correct total height', () => {
    const { container } = render(<Window />)
    const heightContainer = container.querySelector('[style*="height: 350000px"]')
    expect(heightContainer).toBeInTheDocument()
  })

  it('applies correct positioning to container', () => {
    const { container } = render(<Window />)
    const listContainer = container.querySelector('.List')
    
    expect(listContainer).toBeInTheDocument()
  })

  it('handles empty virtual items', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    useWindowVirtualizer.mockReturnValueOnce({
      getTotalSize: jest.fn(() => 0),
      getVirtualItems: jest.fn(() => []),
      options: {
        scrollMargin: 0,
      },
    })

    render(<Window />)
    expect(screen.queryByText('Row 0')).not.toBeInTheDocument()
  })

  it('renders correct number of virtual items', () => {
    render(<Window />)
    const rows = screen.getAllByText(/Row \d+/)
    expect(rows).toHaveLength(3)
  })

  it('applies correct data attributes to virtual items', () => {
    render(<Window />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0.closest('[data-index]')).toHaveAttribute('data-index', '0')
  })
})