'use client';

import { useEffect, useState } from 'react';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { Navbar } from '@/app/components/Navbar';
import { FaUser, FaPhone, FaGraduationCap } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { GiFireplace } from 'react-icons/gi';

interface StudentProfile {
  fullName: string;
  regNumber: string;
  semester: string;
  phone: string;
  email: string;
  batchStream: string;
}

export default function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const docRef = doc(db, 'students', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProfile(docSnap.data() as StudentProfile);
        } else {
          setProfile({
            fullName: '',
            regNumber: '',
            semester: '',
            phone: '',
            email: user.email || '',
            batchStream: '',
          });
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleChange = (field: keyof StudentProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = async () => {
    const user = auth.currentUser;
    if (user && profile) {
      const docRef = doc(db, 'students', user.uid);
      await setDoc(docRef, {
        ...profile,
        uid: user.uid,
        email: user.email,
        timestamp: Date.now(),
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
      <div className="p-6 text-center text-gray-600">Profile data not found.</div>
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
            <h1 className="text-2xl font-semibold">My Profile</h1>
          </div>
        </header>

        <div className="bg-white p-8 rounded shadow max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { label: 'Full Name', icon: <FaUser />, field: 'fullName' },
              { label: 'Registration Number', icon: <FaUser />, field: 'regNumber' },
              { label: 'Semester', icon: <FaGraduationCap />, field: 'semester' },
              { label: 'Phone No', icon: <FaPhone />, field: 'phone' },
              { label: 'Email', icon: <MdEmail />, field: 'email', type: 'email', readOnly: true },
              { label: 'Batch/Stream', icon: <GiFireplace />, field: 'batchStream' },
            ].map(({ label, icon, field, type, readOnly }) => (
              <div key={field}>
                <label className="font-medium flex items-center">
                  {icon}
                  <span className="ml-2">{label}:</span>
                </label>
                <input
                  type={type || 'text'}
                  value={profile[field as keyof StudentProfile] || ''}
                  onChange={(e) => handleChange(field as keyof StudentProfile, e.target.value)}
                  readOnly={editMode ? readOnly : true}
                  className={`w-full p-2 border rounded ${!editMode || readOnly ? 'bg-gray-100' : ''}`}
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded"
              >
                Edit Profile
              </button>
            ) : (
              <button
                onClick={handleSave}
                className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded"
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
