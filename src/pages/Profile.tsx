import { useProfileStore } from '../store/useProfileStore'
import { FileSearch } from 'lucide-react'
import { Link } from 'react-router-dom'
import SkillPill from '../components/SkillPill'

export default function Profile() {
  const { targetRole, extractedSkills, matchScore, matchedSkills, missingSkills } = useProfileStore()

  const hasData = targetRole && matchScore !== null

  if (!hasData) {
    return (
      <div className="p-8">
        <div className="max-w-2xl mx-auto text-center py-16">
          <FileSearch className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-white mb-2">No Profile Data Yet</h1>
          <p className="text-slate-400 mb-8">
            Analyze your resume to see your skills and match score
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
          >
            Analyze Your Resume
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">My Profile</h1>
        <p className="text-slate-400 mb-8">Your skills and analysis results</p>

        {/* Match Score Summary */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-1">Current Match Score</h2>
          <p className="text-indigo-100 text-sm mb-4">for {targetRole}</p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-white">{matchScore}%</span>
            <span className="text-indigo-100">match rate</span>
          </div>
        </div>

        {/* Skills Found */}
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">Skills Found ({matchedSkills.length})</h2>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.map((skill) => (
              <SkillPill key={skill} skill={skill} found={true} />
            ))}
          </div>
        </div>

        {/* Skills to Learn */}
        {missingSkills.length > 0 && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Skills to Learn ({missingSkills.length})
            </h2>
            <div className="flex flex-wrap gap-2">
              {missingSkills.map((skill) => (
                <SkillPill key={skill} skill={skill} found={false} />
              ))}
            </div>
          </div>
        )}

        {/* Detailed Skills Breakdown */}
        {(extractedSkills.languages.length > 0 ||
          extractedSkills.tools.length > 0 ||
          extractedSkills.frameworks.length > 0) && (
          <div className="bg-slate-800 border border-slate-700 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Detailed Breakdown</h2>

            {extractedSkills.languages.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.languages.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-500/20 text-indigo-400 rounded text-sm border border-indigo-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {extractedSkills.tools.length > 0 && (
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.tools.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded text-sm border border-purple-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {extractedSkills.frameworks.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-slate-400 uppercase mb-2">
                  Frameworks
                </h3>
                <div className="flex flex-wrap gap-2">
                  {extractedSkills.frameworks.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded text-sm border border-cyan-500/30"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
