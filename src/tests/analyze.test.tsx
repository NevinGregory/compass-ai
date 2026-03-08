import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SkillPill from '../components/SkillPill'

describe('SkillPill', () => {
  it('renders found skill with green styling', () => {
    render(<SkillPill skill="React" found={true} />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('renders missing skill with red styling', () => {
    render(<SkillPill skill="TypeScript" found={false} />)
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
  })
})