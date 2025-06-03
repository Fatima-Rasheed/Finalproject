'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Navbar } from '@/app/components/Navbar';
import { FaUserCog, FaUser, FaPhone, FaGraduationCap } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { GiFireplace } from "react-icons/gi";
import { IoDocumentTextSharp } from "react-icons/io5";

interface Profile {
  fullName: string;
  designation: string;
  phone: string;
  email: string;
  department: string;
  areaOfExpertise: string;
  officeHours: string;
  educationalBackground: string;
}

export default function SupervisorProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'supervisors', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as Profile);
        } else {
          setProfile({
            fullName: '',
            designation: '',
            phone: '',
            email: user.email || '',
            department: '',
            areaOfExpertise: '',
            officeHours: '',
            educationalBackground: '',
          });
        }
      }
      setLoading(false);
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
      const docRef = doc(db, 'supervisors', user.uid);
      await setDoc(docRef, {
        ...profile,
        uid: user.uid,
        email: user.email,
        timestamp: Date.now()
      });
      setEditMode(false);
      alert('Profile saved successfully!');
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
        Profile data not found.
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

        <div className="bg-white p-8 rounded shadow max-w-5xl h-[450px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: "Full Name", icon: <FaUser />, field: "fullName" },
              { label: "Designation", icon: <IoDocumentTextSharp />, field: "designation" },
              { label: "Department", icon: <GiFireplace />, field: "department" },
              { label: "Phone No", icon: <FaPhone />, field: "phone" },
              { label: "Email", icon: <MdEmail />, field: "email", type: "email", readOnly: true },
              { label: "Office Hours", icon: <MdEmail />, field: "officeHours" },
              { label: "Area Of Expertise", icon: <FaGraduationCap />, field: "areaOfExpertise" },
              { label: "Educational Background", icon: <FaGraduationCap />, field: "educationalBackground" },
            ].map(({ label, icon, field, type, readOnly }) => (
              <div key={field}>
                <label className="font-medium flex items-center">
                  {icon}
                  <span className="ml-2">{label}:</span>
                </label>
                <input
                  type={type || "text"}
                  value={profile[field as keyof Profile] || ""}
                  onChange={(e) => handleChange(field as keyof Profile, e.target.value)}
                  readOnly={editMode ? readOnly : true}
                  className={`w-full p-2 border rounded ${!editMode || readOnly ? 'bg-gray-100' : ''}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-start gap-4 mt-8">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded absolute right-34 w-[200px]"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-[rgb(21,21,21)] text-white py-2 px-6 absolute right-34 rounded w-[200px]"
              >
                Save Profile
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
