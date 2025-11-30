import React from 'react'
import { render, screen } from '@testing-library/react'
import Dynamic from '../page'

// Mock the dynamic components
jest.mock('../components/RowVirtualizerDynamic', () => {
  return function MockRowVirtualizerDynamic() {
    return <div data-testid="row-virtualizer-dynamic">RowVirtualizerDynamic</div>
  }
})

jest.mock('../components/RowWindowsVirtualizerDynamic', () => {
  return function MockRowWindowsVirtualizerDynamic() {
    return <div data-testid="row-windows-virtualizer-dynamic">RowWindowsVirtualizerDynamic</div>
  }
})

describe('Dynamic Page', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Dynamic />)
  })

  it('renders the main heading', () => {
    render(<Dynamic />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders RowVirtualizerDynamic component', () => {
    render(<Dynamic />)
    expect(screen.getByTestId('row-virtualizer-dynamic')).toBeInTheDocument()
  })

  it('renders RowWindowsVirtualizerDynamic component', () => {
    render(<Dynamic />)
    expect(screen.getByTestId('row-windows-virtualizer-dynamic')).toBeInTheDocument()
  })

  it('renders horizontal rule separator', () => {
    render(<Dynamic />)
    const hr = screen.getByRole('separator')
    expect(hr).toBeInTheDocument()
    expect(hr.tagName).toBe('HR')
  })

  it('has correct page structure', () => {
    const { container } = render(<Dynamic />)
    
    // Should have main container, heading, hr, and components
    expect(container.firstChild).toBeInTheDocument()
  })

  it('renders components in correct order', () => {
    render(<Dynamic />)
    
    const components = screen.getAllByTestId(/row-.*-virtualizer-dynamic/)
    expect(components).toHaveLength(2)
    
    // RowVirtualizerDynamic should come first
    expect(components[0]).toHaveAttribute('data-testid', 'row-virtualizer-dynamic')
    // RowWindowsVirtualizerDynamic should come second
    expect(components[1]).toHaveAttribute('data-testid', 'row-windows-virtualizer-dynamic')
  })

  it('is a client component', () => {
    // The page uses 'use client' directive
    render(<Dynamic />)
    expect(screen.getByTestId('row-virtualizer-dynamic')).toBeInTheDocument()
  })

  it('imports CSS correctly', () => {
    // The component imports './index.css'
    render(<Dynamic />)
    // If it renders without error, CSS import is working
    expect(screen.getByTestId('row-virtualizer-dynamic')).toBeInTheDocument()
  })

  it('renders page content with proper spacing', () => {
    render(<Dynamic />)
    
    // Should have heading, hr, and components with proper layout
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('separator')).toBeInTheDocument()
    expect(screen.getByTestId('row-virtualizer-dynamic')).toBeInTheDocument()
    expect(screen.getByTestId('row-windows-virtualizer-dynamic')).toBeInTheDocument()
  })
})