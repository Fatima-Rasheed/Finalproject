
// src/app/page.tsx
'use client';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Inter } from 'next/font/google';


export default function Home() {
  const router = useRouter();


  return (
    
    <div className="flex h-screen">
      {/* Left Section - Black */}
      <div className="flex-1 bg-[rgb(21,21,21)] text-white flex flex-col justify-center items-center">
        <div className="flex flex-col items-center space-y-2">
          <h1 className="text-6xl font-bold font-Inter">
            Welcome to
          </h1>
          <h2 className="text-3xl font-bold font-Encode_Sans_Semi_Condensed">
            FYP Portal
          </h2>
          <h5 className="text-sm  text-gray-300 text-center font-inter">
            The Final Year Project Management System (FYP Portal) was created to
            simplify and enhance the management of final year projects for
            students, supervisors, and administrators.
          </h5>
        </div>

        <div className="mt-6">
          {/* Placeholder for Logo */}
          <img
            src="/illustration.png"
            alt="Logo"
            className="w-72 h-72 object-cover"
          />
        </div>
      </div>


      {/* Right Section */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-2xl font-bold mb-2">Select Your Role</h2>
        <p className="text-gray-600 mb-6">Final Year Project Management System</p>

        <button onClick={() => router.push('/student-login')} className="bg-[rgb(21,21,21)] text-white px-6 py-2 rounded mb-4 w-96">
          Student
        </button>
        <button onClick={() => router.push('/supervisor-login')} className="bg-[rgb(21,21,21)] text-white px-6 py-2 rounded mb-4 w-96">
          Supervisor
        </button>
        <button onClick={() => router.push('/admin-login')} className="bg-[rgb(21,21,21)] text-white px-6 py-2 rounded w-96">
          Admin
        </button>

       </div>
      </div>
  
  );
}
