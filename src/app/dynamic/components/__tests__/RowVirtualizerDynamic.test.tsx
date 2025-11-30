import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import RowVirtualizerDynamic from '../RowVirtualizerDynamic'

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
  scrollToIndex: jest.fn(),
  measureElement: jest.fn(),
}

jest.mock('@tanstack/react-virtual', () => ({
  useVirtualizer: jest.fn(() => mockVirtualizer),
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

describe('RowVirtualizerDynamic', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<RowVirtualizerDynamic />)
  })

  it('renders control buttons', () => {
    render(<RowVirtualizerDynamic />)
    
    expect(screen.getByText('scroll to the top')).toBeInTheDocument()
    expect(screen.getByText('scroll to the middle')).toBeInTheDocument()
    expect(screen.getByText('scroll to the end')).toBeInTheDocument()
    expect(screen.getByText('turn off virtualizer')).toBeInTheDocument()
  })

  it('renders virtualized rows', () => {
    render(<RowVirtualizerDynamic />)
    
    expect(screen.getByText('Row 0')).toBeInTheDocument()
    expect(screen.getByText('Row 1')).toBeInTheDocument()
    expect(screen.getByText('Row 2')).toBeInTheDocument()
  })

  it('renders lorem ipsum text for each row', () => {
    render(<RowVirtualizerDynamic />)
    
    const sentences = screen.getAllByText('Lorem ipsum dolor sit amet')
    expect(sentences.length).toBeGreaterThan(0)
  })

  it('applies correct CSS classes based on row index', () => {
    render(<RowVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0.closest('.ListItemEven')).toBeInTheDocument()
    
    const row1 = screen.getByText('Row 1')
    expect(row1.closest('.ListItemOdd')).toBeInTheDocument()
  })

  it('calls scrollToIndex when scroll to top button is clicked', () => {
    render(<RowVirtualizerDynamic />)
    
    const scrollToTopButton = screen.getByText('scroll to the top')
    fireEvent.click(scrollToTopButton)
    
    expect(mockVirtualizer.scrollToIndex).toHaveBeenCalledWith(0)
  })

  it('calls scrollToIndex when scroll to middle button is clicked', () => {
    render(<RowVirtualizerDynamic />)
    
    const scrollToMiddleButton = screen.getByText('scroll to the middle')
    fireEvent.click(scrollToMiddleButton)
    
    expect(mockVirtualizer.scrollToIndex).toHaveBeenCalledWith(5000) // 10000 / 2
  })

  it('calls scrollToIndex when scroll to end button is clicked', () => {
    render(<RowVirtualizerDynamic />)
    
    const scrollToEndButton = screen.getByText('scroll to the end')
    fireEvent.click(scrollToEndButton)
    
    expect(mockVirtualizer.scrollToIndex).toHaveBeenCalledWith(9999) // count - 1
  })

  it('toggles virtualizer when toggle button is clicked', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    
    render(<RowVirtualizerDynamic />)
    
    const toggleButton = screen.getByText('turn off virtualizer')
    fireEvent.click(toggleButton)
    
    expect(useVirtualizer).toHaveBeenCalledWith(
      expect.objectContaining({
        enabled: false,
      })
    )
  })

  it('updates button text when virtualizer is toggled', () => {
    render(<RowVirtualizerDynamic />)
    
    const toggleButton = screen.getByText('turn off virtualizer')
    fireEvent.click(toggleButton)
    
    expect(screen.getByText('turn on virtualizer')).toBeInTheDocument()
  })

  it('uses correct virtualizer configuration', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    
    render(<RowVirtualizerDynamic />)
    
    expect(useVirtualizer).toHaveBeenCalledWith({
      count: 10000,
      getScrollElement: expect.any(Function),
      estimateSize: expect.any(Function),
      enabled: true,
    })
  })

  it('applies correct transform styles to container', () => {
    render(<RowVirtualizerDynamic />)
    
    const { container } = render(<RowVirtualizerDynamic />)
    const transformContainer = container.querySelector('[style*="translateY(0px)"]')
    
    expect(transformContainer).toBeInTheDocument()
  })

  it('renders list container with correct styles', () => {
    const { container } = render(<RowVirtualizerDynamic />)
    const listContainer = container.querySelector('.List')
    
    expect(listContainer).toHaveStyle({
      height: '400',
      width: '400',
      overflowY: 'auto',
      contain: 'strict',
    })
  })

  it('applies correct data-index attributes to virtual items', () => {
    render(<RowVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0.closest('[data-index]')).toHaveAttribute('data-index', '0')
  })

  it('calls measureElement for virtual items', () => {
    render(<RowVirtualizerDynamic />)
    
    expect(mockVirtualizer.measureElement).toHaveBeenCalled()
  })

  it('renders correct total size container', () => {
    const { container } = render(<RowVirtualizerDynamic />)
    const sizeContainer = container.querySelector('[style*="height: 450000px"]')
    
    expect(sizeContainer).toBeInTheDocument()
  })

  it('handles empty virtual items', () => {
    mockVirtualizer.getVirtualItems.mockReturnValueOnce([])
    
    render(<RowVirtualizerDynamic />)
    expect(screen.queryByText('Row 0')).not.toBeInTheDocument()
  })

  it('applies padding to row content', () => {
    render(<RowVirtualizerDynamic />)
    
    const { container } = render(<RowVirtualizerDynamic />)
    const paddedDiv = container.querySelector('[style*="padding: 10px 0"]')
    
    expect(paddedDiv).toBeInTheDocument()
  })

  it('generates correct number of sentences', () => {
    render(<RowVirtualizerDynamic />)
    
    const { faker } = require('@faker-js/faker')
    expect(faker.lorem.sentence).toHaveBeenCalledTimes(10000)
  })

  it('handles random number generation for sentence length', () => {
    render(<RowVirtualizerDynamic />)
    
    const { faker } = require('@faker-js/faker')
    expect(faker.number.int).toHaveBeenCalledWith({ min: 20, max: 70 })
  })

  it('positions virtual items correctly', () => {
    render(<RowVirtualizerDynamic />)
    
    const row0 = screen.getByText('Row 0')
    expect(row0).toHaveStyle({
      position: 'absolute',
      top: '0',
      left: '0',
      width: '100%',
      transform: 'translateY(0px)',
    })
  })

  it('handles virtualizer being disabled', () => {
    const { useVirtualizer } = require('@tanstack/react-virtual')
    useVirtualizer.mockReturnValueOnce({
      ...mockVirtualizer,
      getVirtualItems: jest.fn(() => []),
    })

    render(<RowVirtualizerDynamic />)
    
    expect(screen.queryByText('Row 0')).not.toBeInTheDocument()
  })
})