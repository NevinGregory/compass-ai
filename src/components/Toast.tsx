import { useEffect } from 'react'
import { useProfileStore } from '../store/useProfileStore'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

export default function Toast() {
  const { toast, clearToast } = useProfileStore()

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        clearToast()
      }, 5000)

      return () => clearTimeout(timer)
    }
  }, [toast, clearToast])

  if (!toast) return null

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info
  }

  const colors = {
    success: 'bg-green-500/10 border-green-500/30 text-green-400',
    error: 'bg-red-500/10 border-red-500/30 text-red-400',
    info: 'bg-blue-500/10 border-blue-500/30 text-blue-400'
  }

  const Icon = icons[toast.type]

  return (
    <div className="fixed top-4 right-4 z-50">
      <div
        className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${colors[toast.type]} shadow-lg backdrop-blur-sm`}
      >
        <Icon className="w-5 h-5 flex-shrink-0" />
        <p className="text-sm font-medium">{toast.message}</p>
        <button
          onClick={clearToast}
          className="ml-2 hover:opacity-70 transition-opacity"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
