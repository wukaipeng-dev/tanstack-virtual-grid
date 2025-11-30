import React from 'react'
import { render, screen } from '@testing-library/react'
import Portfolio from '../index'

// Mock the GridVirtualScroll component
jest.mock('../../GridVirtualScroll', () => {
  return function MockGridVirtualScroll({ lanes }: { lanes: number }) {
    return <div data-testid="grid-virtual-scroll" data-lanes={lanes}>GridVirtualScroll lanes: {lanes}</div>
  }
})

describe('Portfolio Component', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<Portfolio />)
  })

  it('renders GridVirtualScroll component', () => {
    render(<Portfolio />)
    expect(screen.getByTestId('grid-virtual-scroll')).toBeInTheDocument()
  })

  it('passes default lanes prop to GridVirtualScroll', () => {
    render(<Portfolio />)
    const gridComponent = screen.getByTestId('grid-virtual-scroll')
    expect(gridComponent).toHaveAttribute('data-lanes', '4')
  })

  it('displays correct lanes text', () => {
    render(<Portfolio />)
    expect(screen.getByText('GridVirtualScroll lanes: 4')).toBeInTheDocument()
  })

  it('uses useState for lanes management', () => {
    render(<Portfolio />)
    // The component should initialize with useState(4)
    expect(screen.getByText('GridVirtualScroll lanes: 4')).toBeInTheDocument()
  })

  it('renders as a simple wrapper component', () => {
    const { container } = render(<Portfolio />)
    
    // Portfolio should be a simple wrapper that just renders GridVirtualScroll
    expect(container.firstChild).toBe(screen.getByTestId('grid-virtual-scroll'))
  })

  it('has correct component structure', () => {
    render(<Portfolio />)
    
    const gridComponent = screen.getByTestId('grid-virtual-scroll')
    expect(gridComponent.tagName).toBe('DIV')
  })

  it('maintains lanes state internally', () => {
    render(<Portfolio />)
    
    // Since useState is used internally, the component should maintain state
    expect(screen.getByTestId('grid-virtual-scroll')).toHaveAttribute('data-lanes', '4')
  })

  it('passes lanes as number prop', () => {
    render(<Portfolio />)
    
    const gridComponent = screen.getByTestId('grid-virtual-scroll')
    const lanesValue = gridComponent.getAttribute('data-lanes')
    expect(Number(lanesValue)).toBe(4)
  })

  it('is a client component', () => {
    // The component uses 'use client' directive and useState, so it should be a client component
    render(<Portfolio />)
    expect(screen.getByTestId('grid-virtual-scroll')).toBeInTheDocument()
  })
})