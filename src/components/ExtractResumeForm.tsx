import { useState } from 'react'
import { useProfileStore } from '../store/useProfileStore'
import jobTemplates from '../../data/job_templates.json'
import { analyzeResume } from '../services/analysisService'

export default function ExtractResumeForm() {
  const {
    setTargetRole,
    setResumeText,
    setExtractedSkills,
    setMatchResults,
    setLoading,
    setError,
    showToast
  } = useProfileStore()
  const [selectedRole, setSelectedRole] = useState('')
  const [resumeInput, setResumeInput] = useState('')
  const [errors, setErrors] = useState<{ role?: string; resume?: string }>({})

  const MIN_CHARS = 50
  const MAX_CHARS = 5000

  const validateForm = () => {
    const newErrors: { role?: string; resume?: string } = {}

    if (!selectedRole) {
      newErrors.role = 'Please select a target role'
    }

    if (resumeInput.length < MIN_CHARS) {
      newErrors.resume = `Resume must be at least ${MIN_CHARS} characters (${resumeInput.length} current)`
    } else if (resumeInput.length > MAX_CHARS) {
      newErrors.resume = `Resume must be less than ${MAX_CHARS} characters`
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setTargetRole(selectedRole)
    setResumeText(resumeInput)
    setLoading(true)

    try {
      const result = await analyzeResume(resumeInput, selectedRole)

      setExtractedSkills(result.extractedSkills)
      setMatchResults(result.matchedSkills, result.missingSkills, result.matchScore)

      if (result.usedFallback) {
        showToast('Running in offline mode (keyword matching only)', 'info')
      } else {
        showToast('Analysis complete!', 'success')
      }
    } catch (error) {
      console.error('Analysis failed:', error)
      setError('Failed to analyze resume. Please try again.')
      showToast('Analysis failed. Please try again.', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleResumeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value
    setResumeInput(text)

    // Real-time validation feedback
    if (text.length > 0 && text.length < MIN_CHARS) {
      setErrors(prev => ({ ...prev, resume: `Need ${MIN_CHARS - text.length} more characters` }))
    } else if (text.length > MAX_CHARS) {
      setErrors(prev => ({ ...prev, resume: `Remove ${text.length - MAX_CHARS} characters` }))
    } else {
      setErrors(prev => ({ ...prev, resume: undefined }))
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Analyze Your Skills</h1>
      <p className="text-slate-400 mb-8">Select a target role and paste your resume to identify skill gaps</p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selector */}
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-slate-300 mb-2">
            Target Role
          </label>
          <select
            id="role"
            value={selectedRole}
            onChange={(e) => {
              setSelectedRole(e.target.value)
              if (errors.role) setErrors(prev => ({ ...prev, role: undefined }))
            }}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.role ? 'border-red-500' : 'border-slate-700'
            }`}
          >
            <option value="">Select a role...</option>
            {jobTemplates.map((template) => (
              <option key={template.id} value={template.role_title}>
                {template.role_title}
              </option>
            ))}
          </select>
          {errors.role && <p className="text-red-400 text-sm mt-1">{errors.role}</p>}
        </div>

        {/* Resume Textarea */}
        <div>
          <label htmlFor="resume" className="block text-sm font-medium text-slate-300 mb-2">
            Resume Text
          </label>
          <textarea
            id="resume"
            value={resumeInput}
            onChange={handleResumeChange}
            placeholder="Paste your resume or list your skills and experience..."
            rows={12}
            className={`w-full px-4 py-3 bg-slate-800 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              errors.resume ? 'border-red-500' : 'border-slate-700'
            }`}
          />
          <div className="flex justify-between items-center mt-2">
            {errors.resume ? (
              <p className="text-red-400 text-sm">{errors.resume}</p>
            ) : (
              <p className="text-slate-500 text-sm">Minimum {MIN_CHARS} characters required</p>
            )}
            <p className="text-slate-500 text-sm">
              {resumeInput.length}/{MAX_CHARS}
            </p>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
        >
          Analyze Profile
        </button>
      </form>
    </div>
  )
}
