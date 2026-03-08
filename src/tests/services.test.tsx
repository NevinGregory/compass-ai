import { describe, it, expect, vi, beforeEach } from 'vitest'
import { extractSkillsWithFallback, calculateFallbackMatchScore } from '../services/fallbackService'

describe('Fallback Service', () => {
  describe('extractSkillsWithFallback', () => {
    it('extracts matching skills from resume text', () => {
      const resumeText = 'I have experience with React, TypeScript'
      const targetRole = 'Frontend Developer'

      const skills = extractSkillsWithFallback(resumeText, targetRole)

      expect(skills).toContain('React')
      expect(skills).toContain('Typescript')
    })

    it('is case-insensitive', () => {
      const resumeText = 'i know REACT, TYPESCRIPT, and PYTHON'
      const targetRole = 'Frontend Developer'

      const skills = extractSkillsWithFallback(resumeText, targetRole)

      expect(skills).toContain('React')
      expect(skills).toContain('Typescript')
    })

    it('returns empty array when no skills match', () => {
      const resumeText = 'I am a beginner with no technical skills'
      const targetRole = 'Frontend Developer'

      const skills = extractSkillsWithFallback(resumeText, targetRole)

      expect(skills).toEqual([])
    })

    it('handles edge case: skills at word boundaries', () => {
      const resumeText = 'ReactReactReact' // Should not match React
      const targetRole = 'Frontend Developer'

      const skills = extractSkillsWithFallback(resumeText, targetRole)

      expect(skills).not.toContain('React')
    })
  })

  describe('calculateFallbackMatchScore', () => {
    it('calculates correct percentage', () => {
      const foundSkills = ['React', 'TypeScript']
      const requiredSkills = ['React', 'TypeScript', 'Tailwind CSS', 'Next.js']

      const score = calculateFallbackMatchScore(foundSkills, requiredSkills)

      expect(score).toBe(50) // 2 out of 4
    })

    it('returns 0 when no skills match', () => {
      const foundSkills: string[] = []
      const requiredSkills = ['React', 'TypeScript']

      const score = calculateFallbackMatchScore(foundSkills, requiredSkills)

      expect(score).toBe(0)
    })

    it('returns 100 when all skills match', () => {
      const foundSkills = ['React', 'TypeScript', 'Tailwind CSS']
      const requiredSkills = ['React', 'TypeScript', 'Tailwind CSS']

      const score = calculateFallbackMatchScore(foundSkills, requiredSkills)

      expect(score).toBe(100)
    })

    it('handles case-insensitive matching', () => {
      const foundSkills = ['react', 'typescript']
      const requiredSkills = ['React', 'TypeScript', 'Next.js']

      const score = calculateFallbackMatchScore(foundSkills, requiredSkills)

      expect(score).toBe(67) // Math.round(2/3 * 100)
    })
  })
})

describe('Analysis Service', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('uses fallback when API key is missing', async () => {
    // Mock missing API key
    vi.stubGlobal('import.meta', {
      env: {
        VITE_OPENAI_API_KEY: undefined
      }
    })

    const { analyzeResume } = await import('../services/analysisService')

    const resumeText = 'I know React and TypeScript'
    const result = await analyzeResume(resumeText, 'Frontend Developer')

    expect(result.usedFallback).toBe(true)
    expect(result.matchScore).toBeDefined()
  })
})
