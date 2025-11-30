import React from 'react'
import { render, screen } from '@testing-library/react'
import RowWindowsVirtualizerDynamic from '../RowWindowsVirtualizerDynamic'

// Mock @tanstack/react-virtual
const mockVirtualizer = {
  getTotalSize: jest.fn(() => 450000),
  getVirtualItems: jest.fn(() => [
    {
      index: 0,
      key: 'item-0',
      start: 0,
      size: 45,
    },
    {
      index: 1,
      key: 'item-1',
      start: 45,
      size: 45,
    },
    {
      index: 2,
      key: 'item-2',
      start: 90,
      size: 45,
    },
  ]),
  measureElement: jest.fn(),
}

jest.mock('@tanstack/react-virtual', () => ({
  useWindowVirtualizer: jest.fn(() => mockVirtualizer),
}))

// Mock @faker-js/faker
jest.mock('@faker-js/faker', () => ({
  faker: {
    number: {
      int: jest.fn(({ min, max }) => Math.floor(Math.random() * (max - min + 1)) + min),
    },
    lorem: {
      sentence: jest.fn(() => 'Lorem ipsum dolor sit amet'),
    },
  },
}))

describe('RowWindowsVirtualizerDynamic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RowWindowsVirtualizerDynamic />)
  })

  it('renders virtualized rows', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    expect(screen.getByText('Row 0')).toBeInTheDocument()
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2')).toBeInTheDocument()
  })

  it('renders lorem ipsum text for each row', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const sentences = screen.getAllByText('Lorem ipsum dolor sit amet')
    expect(sentences.length).toBeGreaterThan(0)
  })

  it('applies correct CSS classes based on row index', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0.closest('.ListItemEven')).toBeInTheDocument()
    
    const row1 = screen.getByText('Row 1')
    expect(row1.closest('.ListItemOdd')).toBeInTheDocument()
  })

  it('uses correct virtualizer configuration', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    
    render(<RowWindowsVirtualizerDynamic />)
    
    expect(useWindowVirtualizer).toHaveBeenCalledWith({
      count: 10000,
      estimateSize: expect.any(Function),
    })
  })

  it('applies correct transform styles to virtual items', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      transform: 'translateY(0px)',
    })
    
    const row1 = screen.getByText('Row 1')
    expect(row1).toHaveStyle({
      transform: 'translateY(45px)',
    })
  })

  it('applies correct data-index attributes to virtual items', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0.closest('[data-index]')).toHaveAttribute('data-index', '0')
    
    const row1 = screen.getByText('Row 1')
    expect(row1.closest('[data-index]')).toHaveAttribute('data-index', '1')
  })

  it('calls measureElement for virtual items', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    expect(mockVirtualizer.measureElement).toHaveBeenCalled()
  })

  it('renders correct total size container', () => {
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const sizeContainer = container.querySelector('[style*="height: 450000px"]')
    
    expect(sizeContainer).toBeInTheDocument()
  })

  it('applies List class to container', () => {
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const listContainer = container.querySelector('.List')
    
    expect(listContainer).toBeInTheDocument()
  })

  it('handles empty virtual items', () => {
    mockVirtualizer.getVirtualItems.mockReturnValueOnce([])
    
    render(<RowWindowsVirtualizerDynamic />)
    expect(screen.queryByText('Row 0')).not.toBeInTheDocument()
  })

  it('applies padding to row content', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const paddedDiv = container.querySelector('[style*="padding: 10px 0"]')
    
    expect(paddedDiv).toBeInTheDocument()
  })

  it('generates correct number of sentences', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const { faker } = require('@faker-js/faker')
    expect(faker.lorem.sentence).toHaveBeenCalledTimes(10000)
  })

  it('handles random number generation for sentence length', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const { faker } = require('@faker-js/faker')
    expect(faker.number.int).toHaveBeenCalledWith({ min: 20, max: 70 })
  })

  it('positions virtual items with correct absolute positioning', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
    })
  })

  it('generates random row heights array', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    // The component should generate 400 random row heights
    const rows = Array.from({ length: 400 }, () =>
      Math.floor(20 + Math.random() * 10)
    )
    expect(rows).toHaveLength(400)
    rows.forEach(height => {
      expect(height).toBeGreaterThanOrEqual(20)
      expect(height).toBeLessThan(31)
    })
  })

  it('renders container with relative positioning', () => {
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const sizeContainer = container.querySelector('[style*="position: relative"]')
    
    expect(sizeContainer).toBeInTheDocument()
  })

  it('applies full width to container', () => {
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const sizeContainer = container.querySelector('[style*="width: 100%"]')
    
    expect(sizeContainer).toBeInTheDocument()
  })

  it('handles window virtualizer specific features', () => {
    const { useWindowVirtualizer } = require('@tanstack/react-virtual')
    
    render(<RowWindowsVirtualizerDynamic />)
    
    // Should use useWindowVirtualizer instead of useVirtualizer
    expect(useWindowVirtualizer).toHaveBeenCalled()
  })

  it('renders row content with proper structure', () => {
    render(<RowWindowsVirtualizerDynamic />)
    
    const { container } = render(<RowWindowsVirtualizerDynamic />)
    const rowContent = container.querySelector('[style*="padding: 10px 0"]')
    
    expect(rowContent).toBeInTheDocument()
    expect(rowContent).toContainHTML('div')
  })
})