import { useProfileStore } from '../store/useProfileStore'
import SkillPill from './SkillPill'
import Roadmap from './Roadmap'
import { AnalysisViewSkeleton } from './LoadingSkeleton'

export default function AnalysisView() {
  const {
    targetRole,
    extractedSkills,
    matchedSkills,
    missingSkills,
    matchScore,
    isLoading
  } = useProfileStore()

  if (isLoading) {
    return <AnalysisViewSkeleton />
  }

  if (!targetRole || matchScore === null) {
    return null
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-2">Analysis Results</h1>
      <p className="text-slate-400 mb-8">Target Role: <span className="text-indigo-400 font-semibold">{targetRole}</span></p>

      {/* Match Score Card */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white mb-1">Match Score</h2>
            <p className="text-indigo-100">Based on your current skills vs. role requirements</p>
          </div>
          <div className="text-6xl font-bold text-white">
            {matchScore}%
          </div>
        </div>
      </div>

      {/* Two-Column Layout */}
      <div className="grid grid-cols-2 gap-8">
        {/* Left Column: Extracted Profile */}
        <div>
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold text-white mb-4">Extracted Profile</h2>

            {/* Languages */}
            {extractedSkills.languages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.languages.map((skill) => (
                    <SkillPill
                      key={skill}
                      skill={skill}
                      found={matchedSkills.includes(skill)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Tools */}
            {extractedSkills.tools.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.tools.map((skill) => (
                    <SkillPill
                      key={skill}
                      skill={skill}
                      found={matchedSkills.includes(skill)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Frameworks */}
            {extractedSkills.frameworks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">Frameworks</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.frameworks.map((skill) => (
                    <SkillPill
                      key={skill}
                      skill={skill}
                      found={matchedSkills.includes(skill)}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Skills Found Summary */}
            <div className="mt-6 pt-4 border-t border-slate-700">
              <p className="text-slate-300">
                <span className="text-green-400 font-semibold">{matchedSkills.length}</span> skills matched →
                <span className="text-red-400 font-semibold ml-2">{missingSkills.length}</span> skills missing
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Gap Analysis & Roadmap */}
        <div className="space-y-6">
          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold text-white mb-4">Missing Skills</h2>
              <div className="flex flex-wrap gap-2">
                {missingSkills.map((skill) => (
                  <SkillPill key={skill} skill={skill} found={false} />
                ))}
              </div>
            </div>
          )}

          {/* Learning Path */}
          {missingSkills.length > 0 && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <Roadmap missingSkills={missingSkills} />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
