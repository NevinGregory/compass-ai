interface RoadmapItem {
  step: number
  title: string
  description: string
  resource: string
}

interface RoadmapProps {
  missingSkills: string[]
}

export default function Roadmap({ missingSkills }: RoadmapProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-white">Learning Path</h3>
      {missingSkills.map((skill, index) => (
        <div
          key={skill}
          className="border-l-2 border-indigo-500 pl-4"
        >
          <div className="text-indigo-400 font-medium">Step {index + 1}</div>
          <div className="text-white font-semibold mt-1">Learn {skill}</div>
          <div className="text-slate-400 text-sm mt-1">
            Recommended: Online course or tutorial for {skill}
          </div>
        </div>
      ))}
    </div>
  )
}