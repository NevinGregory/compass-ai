import Roadmap from './Roadmap'

export default function Dashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-indigo-400 mb-8">Compass AI</h1>
      <p className="text-slate-300">Skill-Bridge Career Navigator</p>
      <Roadmap missingSkills={["Leadership"]}/>
    </div>
  )
}