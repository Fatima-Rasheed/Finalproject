'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/config';
import { getDocs, collection } from 'firebase/firestore';
import { Navbar } from '@/app/components/Navbar';
import { BsFileEarmarkCheckFill } from "react-icons/bs";

interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  evaluationStatus?: string;
  evaluationRemarks?: string;
}

export default function StudentEvaluationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProject = async () => {
      const user = auth.currentUser;
      if (!user?.email) return;

      const snapshot = await getDocs(collection(db, 'projects'));
      const data: Project[] = snapshot.docs
        .map((docSnap) => {
          const raw = docSnap.data();
          return {
            id: docSnap.id,
            name: raw.name || '',
            description: raw.description || '',
            createdBy: raw.createdBy || '',
            evaluationStatus: raw.evaluationStatus || 'Pending',
            evaluationRemarks: raw.evaluationRemarks || '',
          };
        })
        .filter((p) => p.createdBy === user.email); // ✅ show all projects for current student

      setProjects(data);
      setLoading(false);
    };

    fetchProject();
  }, []);

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin border-blue-500 rounded-full w-16 h-16 border-t-4"></div>
      </div>
    );
  }

  return (
      <div className="flex flex-col flex-1 md:ml-64">
          {/* Navbar */}
          <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
            <Navbar />
          </header>
    <div className="pt-24 pl-[120px] pr-15">
      <div className="bg-black text-white px-4 py-6 rounded-md mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">My Evaluation Result</h2>
         <div className="bg-gray-300 p-2 rounded-full">
                      <BsFileEarmarkCheckFill className="h-6 w-6 text-[rgb(21,21,21)]" />
                    </div>
      </div>

      {projects.length > 0 ? (
        <div className="space-y-4">
          {projects.map((project) => (
            <div key={project.id} className="bg-white p-6 rounded shadow-md space-y-2">
              <div>
                <strong className="text-gray-600">Title:</strong>{' '}
                <span className="text-gray-800 font-bold">{project.name}</span>
              </div>
              <div>
                <strong className="text-gray-60 ">Status:</strong>{' '}
                <span
                  className={
                    project.evaluationStatus === 'Evaluated'
                      ? 'text-green-800 font-bold'
                      : 'text-yellow-800 font-bold'
                  }
                >
                  {project.evaluationStatus}
                </span>
              </div>
              <div>
                <strong className="text-gray-600">Remarks:</strong>{' '}
                <span className="text-gray-800 font-bold">
                  {project.evaluationRemarks || <i>No remarks yet</i>}
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-gray-600">No projects found for your account.</div>
      )}
    </div>
    </div>
  );
}
