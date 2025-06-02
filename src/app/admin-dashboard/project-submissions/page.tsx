'use client'
import { useEffect, useState } from "react"
import { useRouter } from 'next/navigation'
import { Search } from "lucide-react"
import { Navbar } from "@/app/components/Navbar"
import ProjectTable from "@/app/components/admin-projects"
import { FaProjectDiagram } from "react-icons/fa"
import { doc, deleteDoc } from "firebase/firestore"
import { db } from "../../lib/firebase"


interface Project {
  id: number
  groupNumber: number
  name: string
  supervisor: string
  numberOfStudents: number
  area: string
  status: string
}

export default function Dashboard() {
  const [projects, setProjects] = useState<Project[]>([])
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch("/api/projects")
      const data = await res.json()
      setProjects(data)
    }

    fetchProjects()
  }, [])

  // Handler to delete project
  const handleDelete = async (id: number) => {
    try {
      await deleteDoc(doc(db, "projects", id.toString()))
      setProjects(prev => prev.filter(project => project.id !== id))
      alert("Project deleted successfully")
    } catch (error) {
      console.error("Failed to delete project:", error)
      alert("Failed to delete project")
    }
  }

  // Handler to edit project - redirect to edit page
  const handleEdit = (project: Project) => {
    router.push(`/admin-dashboard/projects/edit/${project.id}`)
  }

  // Handler to open messages page for a project
  const handleMessage = (projectId: number) => {
    router.push(`/admin-dashboard/messages/${projectId}`)
  }

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 p-0 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">All Projects</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <FaProjectDiagram className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="min-h-screen bg-gray-50 p-6">
          <div className="max-w-7xl mx-auto">
            <div className="relative mb-6">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="search"
                className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:ring-2 focus:ring-gray-200 focus:outline-none"
                placeholder="Search projects by name..."
              />
            </div>

            <ProjectTable
              projects={projects}
              onDelete={handleDelete}
              onEdit={handleEdit}
              onMessage={handleMessage}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
