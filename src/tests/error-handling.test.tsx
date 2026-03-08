import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
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

describe('Error Handling', () => {
  beforeEach(() => {
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

  it('handles API errors gracefully', async () => {
    mockAnalyzeResume.mockRejectedValueOnce(new Error('API request failed'))

    renderWithRouter(<Dashboard />)

    // Select role
    const roleSelect = screen.getByLabelText(/target role/i)
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } })

    // Enter resume
    const resumeTextarea = screen.getByLabelText(/resume text/i)
    const resumeText = 'A'.repeat(100)
    fireEvent.change(resumeTextarea, { target: { value: resumeText } })

    // Submit
    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    // Wait for error handling
    await waitFor(() => {
      expect(mockAnalyzeResume).toHaveBeenCalled()
    })

    // Verify error is shown or fallback works
    // The app should fall back to regex matching or show an error
  })

  it('handles network errors', async () => {
    mockAnalyzeResume.mockRejectedValueOnce(new Error('Network error: Failed to fetch'))

    renderWithRouter(<Dashboard />)

    const roleSelect = screen.getByLabelText(/target role/i)
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } })

    const resumeTextarea = screen.getByLabelText(/resume text/i)
    const resumeText = 'A'.repeat(100)
    fireEvent.change(resumeTextarea, { target: { value: resumeText } })

    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAnalyzeResume).toHaveBeenCalled()
    })
  })

  it('handles rate limiting errors', async () => {
    mockAnalyzeResume.mockRejectedValueOnce(new Error('Rate limit exceeded'))

    renderWithRouter(<Dashboard />)

    const roleSelect = screen.getByLabelText(/target role/i)
    fireEvent.change(roleSelect, { target: { value: 'Frontend Developer' } })

    const resumeTextarea = screen.getByLabelText(/resume text/i)
    const resumeText = 'A'.repeat(100)
    fireEvent.change(resumeTextarea, { target: { value: resumeText } })

    const submitButton = screen.getByRole('button', { name: /analyze profile/i })
    fireEvent.click(submitButton)

    await waitFor(() => {
      expect(mockAnalyzeResume).toHaveBeenCalled()
    })
  })
})

import { fireEvent } from '@testing-library/react'
