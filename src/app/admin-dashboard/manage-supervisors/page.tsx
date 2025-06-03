'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { MdDelete } from "react-icons/md";
import { Navbar } from '@/app/components/Navbar';
import { ImUserTie } from "react-icons/im";
import { useRouter } from 'next/navigation';

export default function ManageSupervisorsPage() {
  const [supervisors, setSupervisors] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const supervisorsSnapshot = await getDocs(collection(db, 'supervisors'));
      const projectsSnapshot = await getDocs(collection(db, 'projects'));

      const projectData = projectsSnapshot.docs.map(doc => doc.data());

      const updated = supervisorsSnapshot.docs.map(doc => {
        const data = doc.data();
        const fullName = data.fullName?.toLowerCase() || '';

        const studentCount = projectData.filter(
          (project) =>
            project.supervisor?.toLowerCase() === fullName &&
            project.status === 'Approved'
        ).length;

        return { id: doc.id, ...data, studentCount };
      });

      setSupervisors(updated);
    };

    fetchData();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'supervisors', id));
      setSupervisors((prev) => prev.filter(supervisor => supervisor.id !== id));
    } catch (error) {
      console.error("Error deleting document:", error);
    }
  };

  const uniqueSupervisor = supervisors.filter(
    (supervisor, index, self) =>
      index === self.findIndex(s => s.email === supervisor.email)
  );

  const filteredSupervisors = uniqueSupervisor.filter(supervisor =>
    supervisor.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supervisor.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col flex-1 md:ml-64 overflow-x-hidden">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold">All Supervisors</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <ImUserTie className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="flex flex-wrap gap-3 px-6 mt-6">
          <input 
            type="text"
            placeholder="Search by Name or Email"
            className="border rounded px-4 py-2 flex-grow min-w-[200px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button 
            className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded flex items-center"
            onClick={() => router.push('/admin-dashboard/add-supervisors')}
          >
            <ImUserTie className="mr-2" />  
            Add Supervisor
          </button>
        </div>

        <div className="p-6 overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md">
            <thead className="bg-[rgb(21,21,21)] text-white">
              <tr>
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Designation</th>
                <th className="text-left px-4 py-2"> Area of Expertise</th>
                <th className="text-left px-4 py-2">Students</th>
                <th className="text-left px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredSupervisors.map((supervisor) => (
                <tr key={supervisor.id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2 font-bold">{supervisor.fullName || '-'}</td>
                  <td className="px-4 py-2 font-semibold">{supervisor.email || '-'}</td>
                  <td className="px-4 py-2 font-semibold">{supervisor.designation || '-'}</td>
                  <td className="px-4 py-2 font-semibold">{supervisor.areaOfExpertise || '-'}</td>
                  <td className="px-4 py-2 font-semibold">{supervisor.studentCount || 0}</td>
                  <td className="px-4 py-2 font-semibold">
                    <button
                      onClick={() => handleDelete(supervisor.id)}
                      className="text-red-600 hover:underline h-7 w-7"
                    >
                      <MdDelete className="bg-red-200 rounded-full p-2 h-9 w-9" />
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
