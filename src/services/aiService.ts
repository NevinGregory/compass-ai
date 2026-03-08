import { GoogleGenerativeAI } from '@google/generative-ai'

interface ExtractedSkills {
  languages: string[]
  tools: string[]
  frameworks: string[]
}

export async function extractSkillsWithAI(
  resumeText: string,
  targetRole: string
): Promise<ExtractedSkills> {
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY)

  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

  const prompt = `You are a technical recruiter. Analyze the resume and extract skills, categorizing them into:
- Languages (programming languages)
- Tools (development tools, platforms)
- Frameworks (libraries, frameworks)

Analyze this resume for a ${targetRole} role:

${resumeText}

Return ONLY a JSON object with these three arrays. Format:
{"languages": [...], "tools": [...], "frameworks": [...]}`

  try {
    const result = await model.generateContent(prompt)
    const response = result.response
    const text = response.text()

    // Extract JSON from the response (handle potential markdown code blocks)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No valid JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      languages: parsed.languages || [],
      tools: parsed.tools || [],
      frameworks: parsed.frameworks || []
    }
  } catch (error) {
    console.error('AI extraction failed:', error)
    throw new Error('Failed to extract skills with AI')
  }
}

export function calculateMatchScore(
  extractedSkills: ExtractedSkills,
  requiredSkills: string[]
): number {
  const allSkills = [
    ...extractedSkills.languages,
    ...extractedSkills.tools,
    ...extractedSkills.frameworks
  ]

  const matchedSkills = requiredSkills.filter(skill =>
    allSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  )

  return Math.round((matchedSkills.length / requiredSkills.length) * 100)
}
