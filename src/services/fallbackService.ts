import jobTemplates from '../../data/job_templates.json'

const roleKeywords: Record<string, string[]> = {
  'Frontend Developer': ['react', 'typescript', 'javascript', 'html', 'css', 'tailwind', 'nextjs', 'next.js', 'vue', 'angular', 'sass', 'scss', 'redux', 'zustand', 'jest', 'testing library'],
  'Backend Developer': ['node', 'nodejs', 'node.js', 'express', 'python', 'django', 'flask', 'java', 'spring', 'postgresql', 'mysql', 'mongodb', 'redis', 'docker', 'kubernetes', 'aws', 'azure'],
  'Data Scientist': ['python', 'r', 'machine learning', 'tensorflow', 'pytorch', 'pandas', 'numpy', 'scikit-learn', 'sql', 'jupyter', 'statistics', 'deep learning', 'nlp'],
  'DevOps Engineer': ['aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'linux', 'bash', 'python', 'prometheus', 'grafana', 'nginx']
}

export function extractSkillsWithFallback(resumeText: string, targetRole: string) {
  const keywords = roleKeywords[targetRole] || []
  const foundSkills: string[] = []

  const lowerResumeText = resumeText.toLowerCase()

  keywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i')
    if (regex.test(lowerResumeText)) {
      foundSkills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1))
    }
  })

  return foundSkills
}

export function calculateFallbackMatchScore(foundSkills: string[], requiredSkills: string[]): number {
  const matchedCount = requiredSkills.filter(skill =>
    foundSkills.some(found =>
      found.toLowerCase() === skill.toLowerCase()
    )
  ).length

  return Math.round((matchedCount / requiredSkills.length) * 100)
}

export { jobTemplates }
