'use client';

import { useEffect, useState } from 'react';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase/config';
import { toast } from 'react-hot-toast';
import { Navbar } from '@/app/components/Navbar';

interface Project {
  id: string;
  name: string;
  description: string;
  createdBy: string;
  supervisor: string;
  evaluator?: string;
  evaluationStatus?: string;
  evaluationRemarks?: string;
}

export default function AdminEvaluationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [supervisors, setSupervisors] = useState<string[]>([]);
  const [selectedEvaluator, setSelectedEvaluator] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    fetchProjects();
    fetchSupervisors();
  }, []);

  const fetchProjects = async () => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const data: Project[] = snapshot.docs.map((doc) => {
      const raw = doc.data();
      return {
        id: doc.id,
        name: raw.name || '',
        description: raw.description || '',
        createdBy: raw.createdBy || '',
        supervisor: raw.supervisor || '',
        evaluator: raw.evaluator || '',
        evaluationStatus: raw.evaluationStatus || 'Pending',
        evaluationRemarks: raw.evaluationRemarks || '',
      };
    });
    setProjects(data);
  };

  const fetchSupervisors = async () => {
    const snapshot = await getDocs(collection(db, 'supervisors'));
    const names: string[] = snapshot.docs.map((doc) => doc.data().fullName);
    setSupervisors(names);
  };

  const assignEvaluator = async (projectId: string) => {
    const selected = selectedEvaluator[projectId];
    if (!selected) return toast.error('Please select a supervisor');
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        evaluator: selected,
        evaluationStatus: 'Pending',
        evaluationRemarks: '',
      });
      toast.success('Evaluator assigned successfully');
      fetchProjects(); // refresh list
    } catch (error) {
      toast.error('Error assigning evaluator');
    }
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64 overflow-x-hidden">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">All Students</h1>
            <div className="bg-gray-300 p-2 rounded-full"></div>
          </div>
        </header>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-[rgb(21,21,21)] text-white">
              <tr>
                <th className="text-left px-4 py-4">Title</th>
                <th className="text-left px-4 py-3">Student</th>
                <th className="text-left px-4 py-3">Supervisor</th>
                <th className="text-left px-4 py-3">Evaluator</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Remarks</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="border-t">
                  <td className="px-4 py-5 font-bold">{proj.name}</td>
                  <td className="px-4 py-2 font-semibold text-gray-800">{proj.createdBy}</td>
                  <td className="px-4 py-2 font-semibold text-gray-800">{proj.supervisor}</td>
                  <td className="px-4 py-2 font-semibold text-gray-800">
                    <select
                      className="border rounded p-1"
                      value={selectedEvaluator[proj.id] || proj.evaluator || ''}
                      onChange={(e) =>
                        setSelectedEvaluator((prev) => ({
                          ...prev,
                          [proj.id]: e.target.value,
                        }))
                      }
                      disabled={!!proj.evaluator}
                    >
                      <option value="">Select</option>
                      {supervisors.map((sup) => (
                        <option key={sup} value={sup}>
                          {sup}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded text-xs font-semibold ${
                        proj.evaluationStatus === 'Evaluated'
                          ? 'bg-green-100 text-green-800'
                          : proj.evaluationStatus === ' Rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {proj.evaluationStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    {proj.evaluationRemarks ? (
                      <span className="px-2 py-1 rounded bg-blue-100 text-blue-800 text-sm font-medium">
                        {proj.evaluationRemarks}
                      </span>
                    ) : (
                      <i className="text-gray-400">—</i>
                    )}
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => assignEvaluator(proj.id)}
                      className={`px-4 py-1 rounded text-white ${
                        proj.evaluator
                          ? 'bg-gray-400 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700'
                      }`}
                      disabled={!!proj.evaluator}
                    >
                      {proj.evaluator ? 'Assigned' : 'Assign'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
