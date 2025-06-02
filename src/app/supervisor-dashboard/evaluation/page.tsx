'use client';

import { useEffect, useState } from 'react';
import { db, auth } from '@/firebase/config';
import { getDocs, collection, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import { Navbar } from '@/app/components/Navbar';
import { BsFileEarmarkCheckFill } from "react-icons/bs";

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

export default function SupervisorEvaluationPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [remarks, setRemarks] = useState<{ [key: string]: string }>({});
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    if (auth.currentUser) {
      const displayName = auth.currentUser.displayName || '';
      setUserName(displayName);
      fetchProjects(displayName);
    }
  }, []);

  const fetchProjects = async (displayName: string) => {
    const snapshot = await getDocs(collection(db, 'projects'));
    const data: Project[] = snapshot.docs
      .map((docSnap) => {
        const raw = docSnap.data();
        return {
          id: docSnap.id,
          name: raw.name || '',
          description: raw.description || '',
          createdBy: raw.createdBy || '',
          supervisor: raw.supervisor || '',
          evaluator: raw.evaluator || '',
          evaluationStatus: raw.evaluationStatus || '',
          evaluationRemarks: raw.evaluationRemarks || '',
        };
      })
      .filter((p) => p.evaluator === displayName);
    setProjects(data);
  };

  const submitEvaluation = async (projectId: string) => {
    const remark = remarks[projectId];
    if (!remark) return toast.error('Please enter remarks');
    try {
      await updateDoc(doc(db, 'projects', projectId), {
        evaluationStatus: 'Evaluated',
        evaluationRemarks: remark,
      });
      toast.success('Evaluation submitted');
      fetchProjects(userName);
    } catch (err) {
      toast.error('Error submitting evaluation');
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Evaluated':
        return 'bg-green-100 text-green-800 font-semibold rounded-full px-2 py-1 text-sm';
      case 'Rejected':
        return 'bg-red-100 text-red-800 font-semibold rounded-full px-2 py-1 text-sm';
      case 'Pending':
      default:
        return 'bg-yellow-100 text-yellow-800 font-semibold rounded-full px-2 py-1 text-sm';
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
            <h1 className="text-2xl font-semibold">Evaluation Under Me</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <BsFileEarmarkCheckFill className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-[rgb(21,21,21)] text-white">
              <tr>
                <th className="text-left px-4 py-3">Title</th>
                <th className="text-left px-4 py-3">Created By</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Remarks</th>
                <th className="text-left px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((proj) => (
                <tr key={proj.id} className="even:bg-gray-50 odd:bg-white border-t text-left">
                  <td className="px-4 py-4 font-bold">
                    {proj.name || <i className="text-red-500">No Title</i>}
                  </td>
                  <td className="px-4 py-2 font-semibold">{proj.createdBy}</td>
                  <td className="px-4 py-2">
                    <span className={getStatusClass(proj.evaluationStatus || 'Pending')}>
                      {proj.evaluationStatus || 'Pending'}
                    </span>
                  </td>
                  <td className="px-4 py-2 font-semibold">
                    {proj.evaluationStatus === 'Evaluated' ? (
                      <span className="bg-blue-100 text-blue-800 font-semibold rounded-full px-3 py-1 text-sm">
                        {proj.evaluationRemarks}
                      </span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter remarks"
                        className="border rounded p-1 w-full"
                        value={remarks[proj.id] || ''}
                        onChange={(e) =>
                          setRemarks((prev) => ({
                            ...prev,
                            [proj.id]: e.target.value,
                          }))
                        }
                      />
                    )}
                  </td>
                  <td className="px-4 py-2">
                    {proj.evaluationStatus !== 'Evaluated' && (
                      <button
                        onClick={() => submitEvaluation(proj.id)}
                        className="bg-green-100 hover:bg-green-200 text-green-800 px-4 py-1 rounded"
                      >
                        Evaluate Now
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {projects.length === 0 && (
                <tr>
                  <td colSpan={5} className="text-center py-4 text-gray-500">
                    No evaluations assigned.
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
