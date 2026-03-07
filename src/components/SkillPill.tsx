interface SkillPillProps {
  skill: string
  found: boolean
}

export default function SkillPill({ skill, found }: SkillPillProps) {
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
        found
          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
          : 'bg-red-500/20 text-red-400 border border-red-500/30'
      }`}
    >
      {skill}
    </span>
  )
}