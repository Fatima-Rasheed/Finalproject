import { Clock } from "lucide-react"

interface DashboardHeaderProps {
  userName: string
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  return (
    <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Good Evening, {userName}</h1>
        <div className="bg-gray-400 p-2 rounded-full">
          <Clock className="h-6 w-6 text-slate-200" />
        </div>
      </div>
    </header>
  )
}
