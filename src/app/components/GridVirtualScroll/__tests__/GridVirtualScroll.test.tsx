import React from 'react'
import { render, screen } from '@testing-library/react'
import GridVirtualScroll from '../index'

// Mock @tanstack/react-virtual
jest.mock('@tanstack/react-virtual', () => ({
  useWindowVirtualizer: jest.fn(() => ({
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
      {
        index: 2,
        key: 'item-2',
        start: 200,
        size: 100,
      },
    ]),
  })),
}))

describe('GridVirtualScroll', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<GridVirtualScroll lanes={4} />)
  })

  it('renders with correct number of lanes', () => {
    render(<GridVirtualScroll lanes={4} />)
    // The component should render the virtualized items
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
  })

  it('renders with different lane values', () => {
    render(<GridVirtualScroll lanes={2} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders with maximum lane value', () => {
    render(<GridVirtualScroll lanes={10} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('renders with minimum lane value', () => {
    render(<GridVirtualScroll lanes={1} />)
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('applies correct styles to container', () => {
    const { container } = render(<GridVirtualScroll lanes={4} />)
    const gridContainer = container.querySelector('div')
    
    expect(gridContainer).toHaveStyle({
      height: '1000000px',
      position: 'relative',
      width: '100%',
    })
  })

  it('renders virtual items with correct positions', () => {
    render(<GridVirtualScroll lanes={4} />)
    
    const items = screen.getAllByText(/\d+/)
    expect(items).toHaveLength(3)
    
    // Check if first item has correct transform
    const firstItem = screen.getByText('0')
    expect(firstItem).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100px',
      height: '100px',
      transform: 'translateY(0px)',
    })
  })

  it('handles empty virtual items list', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    useWindowVirtualizer.mockReturnValueOnce({
      getTotalSize: jest.fn(() => 0),
      getVirtualItems: jest.fn(() => []),
    })

    const { container } = render(<GridVirtualScroll lanes={4} />)
    expect(container.querySelector('div')).toBeInTheDocument()
  })

  it('handles scrollMargin correctly when ref is null', () => {
    render(<GridVirtualScroll lanes={4} />)
    // Component should still render even when ref.current is null
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  it('uses correct virtualizer configuration', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    
    render(<GridVirtualScroll lanes={4} />)
    
    expect(useWindowVirtualizer).toHaveBeenCalledWith({
      count: 10000,
      estimateSize: expect.any(Function),
      overscan: 5,
      debug: true,
      scrollMargin: 0,
    })
  })

  it('renders items with correct data-index attributes', () => {
    render(<GridVirtualScroll lanes={4} />)
    
    const item0 = screen.getByText('0')
    expect(item0).toHaveAttribute('data-index', '0')
    
    const item1 = screen.getByText('1')
    expect(item1).toHaveAttribute('data-index', '1')
  })

  it('handles large number of items', () => {
    render(<GridVirtualScroll lanes={4} />)
    
    // Should handle the configured count of 10000 items
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    expect(useWindowVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        count: 10000,
      })
    )
  })
})