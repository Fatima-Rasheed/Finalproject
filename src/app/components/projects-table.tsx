'use client';
import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaMessage } from "react-icons/fa6";
import { FaProjectDiagram } from "react-icons/fa";
import { FaFolderOpen } from "react-icons/fa";

// Define types for our project data
type ProjectStatus = "Accepted" | "Pending" | "Rejected";

interface Project {
  id: number;
  serialNo: number;
  name: string;
  supervisor: string;
  type: string;
  groupMembers: string[];
  degreeType: string;
  status: ProjectStatus;
}

interface ProjectsTableProps {
  heading: string;
  projects: Project[];
}

const renderStatusBadge = (status: ProjectStatus) => {
  switch (status) {
    case "Accepted":
      return (
        <Badge className="bg-green-100 text-green-800 rounded-2xl border-green-900 border-2 hover:bg-green-100">
          {status}
        </Badge>
      );
    case "Pending":
      return (
        <Badge className="bg-yellow-100 text-yellow-800 rounded-2xl border-yellow-900 border-2 hover:bg-yellow-100">
          {status}
        </Badge>
      );
    case "Rejected":
      return (
        <Badge className="bg-red-100 text-red-800 rounded-2xl border-red-900 border-2 hover:bg-red-100">
          {status}
        </Badge>
      );
    default:
      return <Badge>{status}</Badge>;
  }
};

export function ProjectsTable({ heading, projects }: ProjectsTableProps) {
  return (
    <div className="overflow-x-auto mt-7">
      <table className="w-full text-md table-auto">
        <thead className="bg-[rgb(21,21,21)] text-white">
          <tr>
            <th className="px-3 py-2 text-left font-bold">S/NO</th>
            <th className="px-3 py-2 text-left font-bold">Project Name</th>
            <th className="px-3 py-2 text-left font-bold">Supervisor</th>
            <th className="px-3 py-2 text-left font-bold">Project Type</th>
            <th className="px-3 py-2 text-left font-bold">Group Members</th>
            <th className="px-3 py-2 text-left font-bold">Degree Type</th>
            <th className="px-3 py-2 text-left font-bold">Status</th>
            <th className="px-3 py-2 text-left font-bold">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {projects.map((project) => (
            <tr key={project.id} className="hover:bg-gray-50">
              <td className="px-3 py-3">{project.serialNo}</td>
              <td className="px-3 py-3 font-medium text-gray-700">{project.name}</td>
              <td className="px-3 py-3">{project.supervisor}</td>
              <td className="px-3 py-3">{project.type}</td>
              <td className="px-3 py-3">
                {Array.isArray(project.groupMembers) ? project.groupMembers.join(", ") : "No members"}
              </td>
              <td className="px-3 py-3">{project.degreeType}</td>
              <td className="px-3 py-3">{renderStatusBadge(project.status)}</td>
              <td className="px-3 py-3">
                <div className="flex space-x-2">
                  <Button variant="ghost" className="text-gray-900 p-2 rounded-full bg-gray-300 flex items-center justify-center">
                    <FaFolderOpen className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" className="text-gray-900 bg-gray-300 rounded-full p-2">
                    <FaMessage className="h-5 w-5" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
