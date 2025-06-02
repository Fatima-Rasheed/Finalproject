'use client';
import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '@/app/lib/firebase';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { AiFillProject } from "react-icons/ai";

interface Project {
  id: string;
  name: string;
  type: string;
  status: string;
  createdBy: string;
}

export default function SupervisorRequestsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchProjects = async () => {
      const user = auth.currentUser;
      if (!user) return;

      const querySnapshot = await getDocs(collection(db, 'projects'));
      const filteredProjects: Project[] = [];

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        if (data.supervisor === user.displayName) {
          filteredProjects.push({
            id: docSnap.id,
            name: data.name,
            type: data.type,
            status: data.status || 'Pending',
            createdBy: data.createdBy || 'N/A',
          });
        }
      });

      setProjects(filteredProjects);
    };

    fetchProjects();
  }, []);

  const updateStatus = async (projectId: string, newStatus: string) => {
    const confirm = window.confirm(`Are you sure you want to ${newStatus.toLowerCase()} this project?`);
    if (!confirm) return;

    try {
      await updateDoc(doc(db, 'projects', projectId), {
        status: newStatus,
      });

      setProjects((prev) =>
        prev.map((p) =>
          p.id === projectId ? { ...p, status: newStatus } : p
        )
      );

      alert(`Project ${newStatus.toLowerCase()} successfully!`);
    } catch (error) {
      console.error(`Error updating project status to ${newStatus}:`, error);
      alert(`Error updating project.`);
    }
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 p-10 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">Project Requests</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <AiFillProject className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="overflow-x-auto bg-white rounded-md shadow-md">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-[rgb(21,21,21)] text-white">
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-2">Student Email</th>
                <th className="px-4 py-2">Project Title</th>
                <th className="px-4 py-2">Type</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project, index) => (
                <tr
                  key={project.id}
                  className="text-center border-b even:bg-gray-100 odd:bg-white"
                >
                  <td className="px-4 py-4 font font-semibold">{index + 1}</td>
                  <td className="px-4 py-2 font font-bold">{project.createdBy}</td>
                  <td className="px-4 py-2 font font-semibold">{project.name}</td>
                  <td className="px-4 py-2 font font-semibold">{project.type}</td>
                  <td className="px-4 py-2 font">
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        project.status === 'Pending'
                          ? 'bg-yellow-100 rounded-full font-semibold text-yellow-900'
                          : project.status === 'Approved'
                          ? 'bg-green-100 rounded-full font-semibold text-green-900'
                          : project.status === 'Rejected'
                          ? 'bg-red-100 rounded-full font-semibold text-red-900'
                          : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      {project.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2">
                    <button
                      onClick={() => router.push(`/supervisor-dashboard/requests/view/${project.id}`)}
                      className="bg-blue-200 text-blue-900 text-xs font-bold px-2 py-1 rounded-md"
                    >
                      View
                    </button>
                    {project.status === 'Pending' && (
                      <>
                        <button
                          onClick={() => updateStatus(project.id, 'Approved')}
                          className="bg-green-100 text-green-900 px-3 py-1 rounded-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(project.id, 'Rejected')}
                          className="bg-red-100 text-red-900 px-3 py-1 rounded-md"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No requests found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
