'use client';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/app/lib/firebase';
import { Navbar } from '@/app/components/Navbar';

export default function EvaluateProject() {
  const { id } = useParams();
  const router = useRouter();
  const [project, setProject] = useState<any>(null);
  const [remarks, setRemarks] = useState('');
  const [grade, setGrade] = useState('');

  useEffect(() => {
    const fetchProject = async () => {
      if (!id) return;
      const docRef = doc(db, 'projects', id as string);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ ...docSnap.data(), id: docSnap.id });
      }
    };
    fetchProject();
  }, [id]);

  const handleSubmit = async () => {
    try {
      const docRef = doc(db, 'projects', id as string);
      await updateDoc(docRef, {
        evaluationStatus: 'Evaluated',
        evaluationRemarks: remarks,
        evaluationGrade: grade,
      });
      alert('Project evaluated successfully!');
      router.push('/supervisor-dashboard/evaluation');
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Something went wrong.');
    }
  };

  if (!project) return <div className="ml-64 p-6">Loading project...</div>;

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 px-8 pb-8">
        <div className="bg-white shadow rounded p-6 max-w-3xl mx-auto">
          <h1 className="text-2xl font-semibold mb-4">Evaluate Project: {project.name}</h1>
          <p className="text-gray-600 mb-6">{project.description}</p>

          <div className="mb-4">
            <label className="font-medium text-sm">Remarks</label>
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              rows={4}
              placeholder="Write evaluation comments..."
            />
          </div>

          <div className="mb-4">
            <label className="font-medium text-sm">Grade</label>
            <input
              type="text"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 mt-1"
              placeholder="A, B+, etc."
            />
          </div>

          <button
            onClick={handleSubmit}
            className="bg-[rgb(21,21,21)] text-white px-6 py-2 rounded hover:bg-gray-800"
          >
            Submit Evaluation
          </button>
        </div>
      </main>
    </div>
  );
}
