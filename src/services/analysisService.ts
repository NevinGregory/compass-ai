import { extractSkillsWithAI, calculateMatchScore } from './aiService'
import { extractSkillsWithFallback, calculateFallbackMatchScore, jobTemplates } from './fallbackService'

export interface AnalysisResult {
  extractedSkills: {
    languages: string[]
    tools: string[]
    frameworks: string[]
  }
  matchedSkills: string[]
  missingSkills: string[]
  matchScore: number
  usedFallback: boolean
}

export async function analyzeResume(
  resumeText: string,
  targetRole: string
): Promise<AnalysisResult> {
  // Find required skills for the target role
  const roleTemplate = jobTemplates.find(t => t.role_title === targetRole)
  const requiredSkills = roleTemplate?.required_skills || []

  const hasApiKey = Boolean(import.meta.env.VITE_OPENAI_API_KEY)

  // Try AI first if API key exists
  if (hasApiKey) {
    try {
      const extractedSkills = await extractSkillsWithAI(resumeText, targetRole)
      const allExtracted = [
        ...extractedSkills.languages,
        ...extractedSkills.tools,
        ...extractedSkills.frameworks
      ]
      const matchedSkills = requiredSkills.filter(skill =>
        allExtracted.some(s => s.toLowerCase() === skill.toLowerCase())
      )
      const missingSkills = requiredSkills.filter(skill =>
        !allExtracted.some(s => s.toLowerCase() === skill.toLowerCase())
      )
      const matchScore = calculateMatchScore(extractedSkills, requiredSkills)

      return {
        extractedSkills,
        matchedSkills,
        missingSkills,
        matchScore,
        usedFallback: false
      }
    } catch (error) {
      // Enhanced error logging based on error type
      if (error instanceof Error) {
        if (error.message.includes('API key')) {
          console.error('Invalid API key, falling back to regex matching')
        } else if (error.message.includes('rate limit')) {
          console.error('Rate limit hit, falling back to regex matching')
        } else if (error.message.includes('network') || error.message.includes('fetch')) {
          console.error('Network error, falling back to regex matching')
        } else {
          console.error('AI extraction failed, falling back to regex:', error.message)
        }
      } else {
        console.error('AI extraction failed with unknown error, falling back to regex')
      }
      // Fall through to fallback
    }
  } else {
    console.info('No API key found, using fallback regex matching')
  }

  // Use fallback (regex-based) extraction
  const foundSkills = extractSkillsWithFallback(resumeText, targetRole)
  const matchedSkills = requiredSkills.filter(skill =>
    foundSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  )
  const missingSkills = requiredSkills.filter(skill =>
    !foundSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  )
  const matchScore = calculateFallbackMatchScore(foundSkills, requiredSkills)

  // Categorize found skills for consistency
  const extractedSkills = {
    languages: foundSkills,
    tools: [],
    frameworks: []
  }

  return {
    extractedSkills,
    matchedSkills,
    missingSkills,
    matchScore,
    usedFallback: true
  }
}
