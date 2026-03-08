export function MatchScoreSkeleton() {
  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 rounded-lg p-6 mb-8 animate-pulse">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-6 bg-slate-600 rounded w-32 mb-2"></div>
          <div className="h-4 bg-slate-600 rounded w-48"></div>
        </div>
        <div className="h-16 bg-slate-600 rounded w-24"></div>
      </div>
    </div>
  )
}

export function SkillListSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-40 mb-4"></div>
      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-8 bg-slate-700 rounded-full w-20"></div>
        ))}
      </div>
    </div>
  )
}

export function RoadmapSkeleton() {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-pulse">
      <div className="h-6 bg-slate-700 rounded w-32 mb-6"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="border-l-2 border-slate-700 pl-4 mb-6">
          <div className="h-4 bg-slate-700 rounded w-16 mb-2"></div>
          <div className="h-5 bg-slate-700 rounded w-32 mb-1"></div>
          <div className="h-4 bg-slate-700 rounded w-48"></div>
        </div>
      ))}
    </div>
  )
}

export function AnalysisViewSkeleton() {
  return (
    <div className="p-8 space-y-6 animate-pulse">
      <div className="h-8 bg-slate-800 rounded w-64"></div>
      <div className="h-4 bg-slate-800 rounded w-48"></div>
      <MatchScoreSkeleton />
      <div className="grid grid-cols-2 gap-8">
        <SkillListSkeleton />
        <div className="space-y-6">
          <SkillListSkeleton />
          <RoadmapSkeleton />
        </div>
      </div>
    </div>
  )
}
