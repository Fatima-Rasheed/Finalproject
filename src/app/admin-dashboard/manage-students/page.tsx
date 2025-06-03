  'use client';

  import { useEffect, useState } from 'react';
  import { db } from '../../lib/firebase';
  import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
  import { Navbar } from '@/app/components/Navbar';
  import { FaUserGraduate } from "react-icons/fa";
  import { MdDelete } from "react-icons/md";
  import { useRouter } from 'next/navigation';

  export default function ManageStudentsPage() {
    const [students, setStudents] = useState<any[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    useEffect(() => {
      const fetchStudents = async () => {
        const snapshot = await getDocs(collection(db, 'students'));
        const studentList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setStudents(studentList);
      };
      fetchStudents();
    }, []);

    const handleDelete = async (id: string) => {
      await deleteDoc(doc(db, 'students', id));
      setStudents(prev => prev.filter(student => student.id !== id));
    };

    const uniqueStudents = students.filter(
      (student, index, self) =>
        index === self.findIndex(s => s.email === student.email)
    );

    const filteredStudents = uniqueStudents.filter(student =>
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.regNo?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="flex flex-col flex-1 md:ml-64 overflow-x-hidden">
        {/* Navbar */}
        <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
          <Navbar />
        </header>

        <main className="pt-20 pb-0">
          {/* Header */}
          <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
            <div className="container mx-auto flex justify-between items-center">
              <h1 className="text-2xl font-semibold">All Students</h1>
              <div className="bg-gray-300 p-2 rounded-full">
                <FaUserGraduate className="h-6 w-6 text-[rgb(21,21,21)]" />
              </div>
            </div>
          </header>

          {/* Search & Add Button */}
          <div className="flex flex-wrap gap-3 px-6 mt-6">
            <input 
              type="text"
              placeholder="Search by Name, Email, or Reg No"
              className="border rounded px-4 py-2 flex-grow min-w-[200px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button 
              className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded flex items-center"
              onClick={() => router.push('/admin-dashboard/add-student')} 
            >
              <FaUserGraduate className="mr-2" />  
              Add Student
            </button>
          </div>

          {/* Table */}
          <div className="p-6 overflow-x-auto">
            <table className="min-w-full bg-white rounded-xl overflow-hidden shadow-md">
              <thead>
                <tr className="bg-[rgb(21,21,21)] text-white font-bold">
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Email</th>
                  <th className="px-4 py-2 text-left">Reg No</th>
                  <th className="px-4 py-2 text-left">Batch Stream</th>
                  <th className="px-4 py-2 text-left">Semester</th>
                  <th className="px-4 py-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2 font-bold">{student.fullName || '-'}</td>
                    <td className="px-4 py-2 font-semibold">{student.email || '-'}</td>
                    <td className="px-4 py-2 font-semibold">{student.regNumber || student.regNo || '-'}</td>
                    <td className="px-4 py-2 font-semibold">{student.batchStream || '-'}</td>
                    <td className="px-4 py-2 font-semibold">{student.semester || '-'}</td>
                    <td className="px-4 py-2">
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="text-red-600 hover:underline"
                      >
                        <MdDelete className="bg-red-200 rounded-full p-2 h-8 w-8" />
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
