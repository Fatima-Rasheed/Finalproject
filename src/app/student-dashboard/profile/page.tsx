'use client';
import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Navbar } from '@/app/components/Navbar';
import { FaUserCog } from "react-icons/fa";
import { GoGraph } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { TiGroup } from "react-icons/ti";
import { MdEmail } from "react-icons/md";
import { FaPhone } from "react-icons/fa";
import { IoDocumentTextSharp } from "react-icons/io5";
import { FaGraduationCap } from "react-icons/fa";
import { GiFireplace } from "react-icons/gi";
import { useRouter } from "next/navigation";

interface Profile {
  fullName: string;
  regNo: string;
  batch: string;
  phone: string;
  email: string;
  department: string;
  program: string;
  batchStream: string;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ new state
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'students', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        }
      }
      setLoading(false); // ✅ stop loading once auth check completes
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (field: keyof Profile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user && profile) {
      const docRef = doc(db, 'students', user.uid);
      await updateDoc(docRef, { ...profile });
      setEditMode(false);
      alert('Profile updated successfully');
    }
  };

  if (loading) {
    return (
      <div className="p-6 flex justify-center items-center">
        <div className="animate-spin border-blue-500 rounded-full w-16 h-16 border-t-4"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 text-center text-gray-600">
        Profile not found.
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <main className="pt-20 p-10 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-semibold"> My Profile</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <FaUserCog className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>

        <div className="bg-white p-8 rounded shadow max-w-5xl  h-[450px]    mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center font-medium">
                <FaUser className="mr-2" /> Full Name:
              </label>
              <input type="text" value={profile.fullName} onChange={(e) => handleChange('fullName', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <IoDocumentTextSharp className="mr-2" />Reg No:
              </label>
              <input type="text" value={profile.regNo} onChange={(e) => handleChange('regNo', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <TiGroup className="mr-2" />Session:
              </label>
              <input type="text" value={profile.batch} onChange={(e) => handleChange('batch', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <FaPhone className="mr-2" />Phone No:
              </label>
              <input type="text" value={profile.phone} onChange={(e) => handleChange('phone', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <MdEmail className="mr-2" />Email:
              </label>
              <input type="email" value={profile.email} readOnly className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <GiFireplace className="mr-2" />Department:
              </label>
              <input type="text" value={profile.department} onChange={(e) => handleChange('department', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <FaGraduationCap className="mr-2" />Program:
              </label>
              <input type="text" value={profile.program} onChange={(e) => handleChange('program', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
            <div>
              <label className="font-medium flex items-center">
                <GoGraph className="mr-2" />Batch Stream:
              </label>
              <input type="text" value={profile.batchStream} onChange={(e) => handleChange('batchStream', e.target.value)} disabled={!editMode} className="w-full p-2 border rounded bg-gray-100" />
            </div>
          </div>

          {!editMode ? (
            <button className="bg-[rgb(21,21,21)] mr-8 absolute right-32 text-white py-2 mt-9 px-6 rounded w-[200px]" onClick={() => setEditMode(true)}>
              Edit Profile
            </button>
          ) : (
            <button className="bg-[rgb(21,21,21)] mr-8 text-white py-2  absolute right-32    mt-9 px-6 rounded w-[200px]" onClick={handleSave}>
              Save Profile
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
