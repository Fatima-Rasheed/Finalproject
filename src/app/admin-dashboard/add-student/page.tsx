'use client';

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { FaUserGraduate } from "react-icons/fa";

export default function AddStudentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    regNumber: '',
    batchStream: '',
    semester: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!formData.email) return alert('Email is required');
    try {
      await setDoc(doc(collection(db, 'students'), formData.email), {
        fullName: formData.fullName,
        email: formData.email,
        regNumber: formData.regNumber,
        department: formData.batchStream,
        semester: formData.semester,
        phone: '',
        cgpa: '',
        skills: '',
        bio: '',
      });
      alert('Student added successfully!');
      setFormData({
        fullName: '',
        email: '',
        regNumber: '',
        batchStream: '',
        semester: '',
      });
      router.push('/admin-dashboard/manage-students');
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64 overflow-x-hidden">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>

      <main className="pt-20 p- pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Add New Student</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <FaUserGraduate className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="bg-white p-8 rounded shadow max-w-5xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-medium">Full Name</label>
              <input
                className="w-full border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Email</label>
              <input
                className="w-full border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Reg No</label>
              <input
                className="w-full border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                name="regNumber"
                placeholder="Registration Number"
                value={formData.regNumber}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Batch Stream</label>
              <input
                className="w-full border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                name="batchStream"
                placeholder="Batch"
                value={formData.batchStream}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block font-medium">Semester</label>
              <input
                className="w-full border p-3 rounded bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
                type="text"
                name="semester"
                placeholder="Semester"
                value={formData.semester}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="mt-6 w-full bg-[rgb(21,21,21)] text-white py-3 rounded hover:bg-gray-700 transition"
          >
            Add Student
          </button>
        </div>
      </main>
    </div>
  );
}
