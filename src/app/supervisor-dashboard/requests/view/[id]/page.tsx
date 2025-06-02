'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';

export default function ProjectDetailsPage() {
  const params = useParams();
  const { id } = params;
  const [project, setProject] = useState<any>(null);

  useEffect(() => {
    const fetchProject = async () => {
      const docRef = doc(db, 'projects', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject(docSnap.data());
      }
    };
    fetchProject();
  }, [id]);

  if (!project) return <div className="ml-64 p-10">Loading...</div>;

  return (
    
    
    <div className="ml-64 p-10">
      <div className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-6 shadow-md">
        <h1 className="text-2xl font-bold">Project Details</h1>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-4 text-sm">
        <div><strong>📌 Project Title:</strong> {project.name}</div>
        <div><strong>📂 Type:</strong> {project.type}</div>
        <div><strong>📝 Description:</strong> {project.description}</div>
        <div><strong>📧 Student Email:</strong> {project.createdBy}</div>
        <div><strong>👨‍🏫 Supervisor:</strong> {project.supervisor}</div>
        <div><strong>📅 Created At:</strong> {new Date(project.createdAt?.seconds * 1000).toLocaleString()}</div>
        <div>
          <strong>🚦 Status:</strong>
          <span className={`ml-2 px-2 py-1 rounded text-sm ${
            project.status === 'Pending' ? 'bg-yellow-200 text-yellow-800' :
            project.status === 'Approved' ? 'bg-green-200 text-green-800' :
            project.status === 'Rejected' ? 'bg-red-200 text-red-800' :
            'bg-gray-200 text-gray-800'
          }`}>
            {project.status || 'N/A'}
          </span>
        </div>
      </div>
    </div>
  );
}
