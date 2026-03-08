import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../components/Dashboard'
import { useProfileStore } from '../store/useProfileStore'

// Mock the analysis service
vi.mock('../services/analysisService', () => ({
  analyzeResume: vi.fn()
}))

import { analyzeResume } from '../services/analysisService'

const mockAnalyzeResume = analyzeResume as ReturnType<typeof vi.fn>

const renderWithRouter = (component: React.ReactNode) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Full Analysis Flow', () => {
  beforeEach(() => {
    // Reset the store before each test
    useProfileStore.setState({
      targetRole: null,
      resumeText: '',
      extractedSkills: { languages: [], tools: [], frameworks: [] },
      matchedSkills: [],
      missingSkills: [],
      matchScore: null,
      isLoading: false,
      error: null,
      toast: null
    })
    vi.clearAllMocks()
  })

  it('completes happy path: submit resume → see analysis → update skills', async () => {
    mockAnalyzeResume.mockResolvedValueOnce({
      extractedSkills: {
        languages: ['Python', 'JavaScript'],
        tools: ['Git'],
        frameworks: ['React']
      },
      matchedSkills: ['React', 'TypeScript'],
      missingSkills: ['Tailwind CSS', 'Next.js', 'Testing Library'],
      matchScore: 40,
      usedFallback: false
    })

    renderWithRouter(<Dashboard />)

    // Verify form is shown initially
    expect(screen.getByText('Analyze Your Skills')).toBeInTheDocument()

    // Select role
    const roleSelect = screen.getByLabelText(/target role/i)
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } })

    // Enter resume text
    const resumeTextarea = screen.getByLabelText(/resume text/i)
    const resumeText = 'Experienced developer with Python, JavaScript, Git, and React skills. '.repeat(2)
    fireEvent.change(resumeTextarea, { target: { value: resumeText } })

    // Submit form
    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    // Wait for analysis to complete
    await waitFor(() => {
      expect(mockAnalyzeResume).toHaveBeenCalledWith(resumeText, 'Frontend Developer')
    })

    // Verify results are displayed
    await waitFor(() => {
      expect(screen.getByText(/analysis results/i)).toBeInTheDocument()
      expect(screen.getByText(/40%/)).toBeInTheDocument()
    })
  })

  it('shows validation error for short resume', async () => {
    renderWithRouter(<Dashboard />)

    const roleSelect = screen.getByLabelText(/target role/i)
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } })

    const resumeTextarea = screen.getByLabelText(/resume text/i)
    fireEvent.change(resumeTextarea, { target: { value: 'Too short' } })

    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/must be at least 50 characters/i)).toBeInTheDocument()
    })
  })

  it('shows validation error when no role selected', async () => {
    renderWithRouter(<Dashboard />)

    const resumeTextarea = screen.getByLabelText(/resume text/i)
    const resumeText = 'A'.repeat(100)
    fireEvent.change(resumeTextarea, { target: { value: resumeText } })

    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/please select a target role/i)).toBeInTheDocument()
    })
  })
})
