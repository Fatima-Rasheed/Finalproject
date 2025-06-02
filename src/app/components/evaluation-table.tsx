"use client"

import type React from "react"

import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { User, Check, MessageCircle, Edit, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
 interface ProjectData {
  id: number
  name: string
  assignee: string
  reviewer: string
  status: "Accepted" | "Rejected" | "Pending"
}

interface ProjectTableProps {
  projects: ProjectData[]
}

export default function ProjectTable({ projects }: ProjectTableProps) {
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-gray-200 bg-[rgb(21,21,21)] text-left text-sm font-bold text-white">
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Project Name</th>
            <th className="px-4 py-3">Assignee</th>
            <th className="px-4 py-3">Reviewer</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              className="border-b border-gray-200 hover:bg-gray-50"
              onMouseEnter={() => setHoveredRow(project.id)}
              onMouseLeave={() => setHoveredRow(null)}
            >
              <td className="px-4 py-3 text-md text-gray-700">{project.id}</td>
              <td className="px-4 py-3 text-md font-medium text-gray-700">{project.name}</td>
              <td className="px-4 py-3">
                <span className="inline-flex rounded-full bg-blue-100 px-3 py-1 text-md font-medium text-blue-800">
                  {project.assignee}
                </span>
              </td>
              <td className="px-4 py-3">
                {project.reviewer !== "Not Assigned" ? (
                  <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-md font-medium text-green-800">
                    {project.reviewer}
                  </span>
                ) : (
                  <span className="inline-flex rounded-full bg-yellow-100 px-3 py-1 text-md font-medium text-yellow-800">
                    {project.reviewer}
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <StatusBadge status={project.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center space-x-2">
                  {project.status === "Accepted" && (
                    <>
                      <ActionButton
                        icon={<User size={16} />}
                        tooltip="Manage Users"
                        onClick={() => console.log("Manage users for", project.id)}
                        visible={true}
                      />
                      <ActionButton
                        icon={<Check size={16} />}
                        tooltip="Approve"
                        onClick={() => console.log("Approve", project.id)}
                        visible={true}
                        className="bg-green-200 text-green-800 hover:bg-green-600"
                      />
                      <ActionButton
                        icon={<MessageCircle size={16} />}
                        tooltip="Comments"
                        onClick={() => console.log("Comments for", project.id)}
                        visible={true}
                        className="bg-purple-200 text-purple-800 font-bold hover:bg-purple-600"
                      />
                    </>
                  )}
                  <ActionButton
                    icon={<Edit size={16} />}
                    tooltip="Edit"
                    onClick={() => console.log("Edit", project.id)}
                    visible={true}
                    className="bg-blue-200 text-blue-800 hover:bg-blue-600"
                  />
                  <ActionButton
                    icon={<Trash2 size={16} />}
                    tooltip="Delete"
                    onClick={() => console.log("Delete", project.id)}
                    visible={true}
                    className="bg-red-200 text-red-800 hover:bg-red-600"
                  />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

interface StatusBadgeProps {
  status: string
}

function StatusBadge({ status }: StatusBadgeProps) {
  if (status === "Accepted") {
    return (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-green-500"></span>
        {status}
      </Badge>
    )
  }

  if (status === "Rejected") {
    return (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
        <span className="mr-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        {status}
      </Badge>
    )
  }

  return (
    <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
      <span className="mr-1.5 h-2 w-2 rounded-full bg-yellow-500"></span>
      {status}
    </Badge>
  )
}

interface ActionButtonProps {
  icon: React.ReactNode
  tooltip: string
  onClick: () => void
  visible: boolean
  className?: string
}

function ActionButton({ icon, tooltip, onClick, visible, className }: ActionButtonProps) {
  if (!visible) return null

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-full transition-colors",
        "bg-gray-200 text-gray-600 hover:bg-gray-300",
        className,
      )}
      title={tooltip}
    >
      {icon}
    </button>
  )
}
