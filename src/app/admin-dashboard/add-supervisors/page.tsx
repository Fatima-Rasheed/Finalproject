// ✅ FILE PATH: src/app/admin-dashboard/add-supervisor/page.tsx

'use client';

import { useState } from 'react';
import { db } from '../../lib/firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { ImUserTie } from "react-icons/im";

export default function AddSupervisorPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [designation, setDesignation] = useState('');
  const [interestedArea, setInterestedArea] = useState('');


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !designation|| !interestedArea ) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      await addDoc(collection(db, 'supervisors'), {
        fullName,
        email,
        designation,
        interestedArea,
   

        createdAt: new Date()
      });
      alert('Supervisor added successfully!');
      router.push('/admin-dashboard/manage-supervisors');
    } catch (error) {
      console.error('Error adding supervisor:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  return (
      <div className="flex flex-col flex-1 md:ml-64">
              {/* Navbar */}
              <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
                <Navbar />
              </header>
                <main className="pt-20 p-30 pb-0">
                    <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Add New Supervisor</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              < ImUserTie className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>
     <div className="bg-white p-8 h-[500px] rounded shadow max-w-5xl mx-auto">
      {/* <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md p-8"> */}
       
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter supervisor's name"
            />
          </div>
          <div>
            <label className="block font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter email address"
            />
          </div>
          <div>
            <label className="block font-medium">Designation</label>
            <input
              type="text"
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter Post"
            />
          </div>
            <div>
            <label className="block font-medium">Interested Area</label>
            <input
              type="text"
              value={interestedArea}
              onChange={(e) => setInterestedArea(e.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Area of interests"
            />
          </div>
         
          
           
          <button
            type="submit"
            className="bg-black absolute right-45 text-white px-4 mt-3 py-2 rounded hover:bg-gray-800"
          >
            Add Supervisor
          </button>
        </form>
      </div>
    {/* </div> */}
    </main>
 </div>
  );
}
