import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
})

interface ExtractedSkills {
  languages: string[]
  tools: string[]
  frameworks: string[]
}

export async function extractSkillsWithAI(
  resumeText: string,
  targetRole: string
): Promise<ExtractedSkills> {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a technical recruiter. Analyze the resume and extract skills, categorizing them into:
- Languages (programming languages)
- Tools (development tools, platforms)
- Frameworks (libraries, frameworks)

Return ONLY a JSON object with these three arrays.`
        },
        {
          role: 'user',
          content: `Analyze this resume for a ${targetRole} role:\n\n${resumeText}`
        }
      ],
      response_format: { type: 'json_object' }
    })

    const result = JSON.parse(completion.choices[0].message.content || '{}')
    return {
      languages: result.languages || [],
      tools: result.tools || [],
      frameworks: result.frameworks || []
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