import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useProfileStore } from '../store/useProfileStore'
import jobTemplates from '../../data/job_templates.json'
import { Search, ChevronRight } from 'lucide-react'

export default function Library() {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const { setTargetRole, setResumeText } = useProfileStore()

  const filteredRoles = jobTemplates.filter(role =>
    role.role_title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.required_skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleSelectRole = (roleTitle: string) => {
    setTargetRole(roleTitle)
    setResumeText('') // Clear any existing resume
    navigate('/')
  }

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2">Role Library</h1>
        <p className="text-slate-400 mb-8">Browse industry roles and their skill requirements</p>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search roles or skills..."
              className="w-full pl-12 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          {searchQuery && (
            <p className="text-slate-400 text-sm mt-2">
              Found {filteredRoles.length} role{filteredRoles.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>

        {/* Role Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredRoles.map((role) => (
            <div
              key={role.id}
              className="bg-slate-800 border border-slate-700 rounded-lg p-6 hover:border-indigo-500 transition-colors"
            >
              <h2 className="text-xl font-semibold text-white mb-2">{role.role_title}</h2>
              <p className="text-slate-400 text-sm mb-4">{role.description}</p>

              {/* Required Skills */}
              <div className="mb-4">
                <h3 className="text-sm font-medium text-slate-300 mb-2">Required Skills:</h3>
                <div className="flex flex-wrap gap-2">
                  {role.required_skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-2 py-1 bg-slate-700 text-slate-300 rounded text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <button
                onClick={() => handleSelectRole(role.role_title)}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
              >
                Analyze for this role
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        {filteredRoles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-400">No roles found matching "{searchQuery}"</p>
          </div>
        )}
      </div>
    </div>
  )
}
