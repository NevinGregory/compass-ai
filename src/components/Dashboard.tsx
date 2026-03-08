import { useProfileStore } from '../store/useProfileStore'
import ExtractResumeForm from './ExtractResumeForm'
import AnalysisView from './AnalysisView'

export default function Dashboard() {
  const { matchScore, reset } = useProfileStore()

  const handleReset = () => {
    reset()
  }

  // Show analysis if we have results, otherwise show form
  if (matchScore !== null) {
    return (
      <div className="relative">
        <button
          onClick={handleReset}
          className="absolute top-8 right-8 px-4 py-2 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-colors"
        >
          New Analysis
        </button>
        <AnalysisView />
      </div>
    )
  }

  return <ExtractResumeForm />
}