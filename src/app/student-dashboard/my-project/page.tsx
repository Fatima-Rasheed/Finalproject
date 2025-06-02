'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '@/app/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, where, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { Navbar } from '@/app/components/Navbar';
import { FaProjectDiagram } from 'react-icons/fa';

export default function MyProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const q = query(
          collection(db, 'projects'),
          where('createdBy', '==', user.email)
        );
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
        setProjects(data);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const deleteProject = async (projectId: string) => {
    try {
      await deleteDoc(doc(db, 'projects', projectId));
      setProjects((prevProjects) =>
        prevProjects.filter((project) => project.id !== projectId)
      );
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-500">Loading your projects...</div>
    );
  }

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">My Projects</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <FaProjectDiagram className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="p-8">
          <div className="overflow-x-auto bg-white rounded shadow">
            <table className="min-w-full text-sm">
              <thead className="bg-[rgb(21,21,21)] text-white">
                <tr>
                  <th className="py-4 px-4 text-left">S/NO</th>
                  <th className="py-3 px-4 text-left">Project Name</th>
                  <th className="py-3 px-4 text-left">Supervisor</th>
                  <th className="py-3 px-4 text-left">Project Type</th>
                  <th className="py-3 px-4 text-left">Group Members</th>
                  <th className="py-3 px-4 text-left">Status</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project, index) => {
                  const status = project.status || 'Pending';
                  const rowBg = index % 2 === 0 ? 'bg-white' : 'bg-gray-100';

                  return (
                    <tr key={index} className={`${rowBg} border-t`}>
                      <td className="py-3 px-5">{index + 1}</td>
                      <td className="py-2 px-4 font-bold">{project.name || 'N/A'}</td>
                      <td className="py-2 px-4 font-semibold">{project.supervisor || 'N/A'}</td>
                      <td className="py-2 px-4 font-semibold">{project.type || 'N/A'}</td>
                      <td className="py-2 px-4 font-semibold">
                        {project.groupMembers?.join(', ') || 'No members'}
                      </td>
                      <td className="py-2 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            status === 'Approved'
                              ? 'bg-green-100 text-green-800'
                              : status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : status === 'Rejected'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => deleteProject(project.id)}
                          className="bg-red-100 text-red-900 py-1 px-3 rounded-full text-xs font-semibold  hover:bg-red-700 focus:outline-none"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={7} className="text-center py-4 text-gray-500">
                      No projects found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
