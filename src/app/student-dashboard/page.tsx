// src/app/student-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, getDocs, doc, getDoc } from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import DashboardHeader from "../components/dashboard-header";
import StepCard from "../components/step-card";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>(""); // <-- NAME STATE
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const router = useRouter();

  // ✅ Fetch name from Firestore
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserEmail(user.email);
        const docRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.fullName || "Student");
        }
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchDocs = async () => {
      const snapshot = await getDocs(collection(db, "student_documents"));
      const docs = snapshot.docs.map((doc) => doc.data());
      setDocuments(docs);
    };
    fetchDocs();
  }, []);

  const handleUpload = async () => {
    if (!file || !userEmail) return;
const storageRef = ref(storage, `documents/${file.name}`);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);

    await addDoc(collection(db, "student_documents"), {
      name: file.name,
      url,
      uploadedAt: new Date().toISOString(),
      uploadedBy: userEmail,
      status: "Draft",
      version: "v1.0",
    });

    setFile(null);
    alert("File uploaded successfully");
  };

  const steps = [
    {
      number: 1,
      title: "Complete Your Profile",
      description: "Update your personal information and academic details",
      icon: "user",
      onClick: () => router.push("/student-dashboard/profile"),
    },
    {
      number: 2,
      title: "Create New Project",
      description: "Submit your project proposal with all required details",
      icon: "layout",
      onClick: () => router.push("/student-dashboard/create-project"),
    },
    {
      number: 3,
      title: "Follow Up Your Project",
      description: "Track progress and respond to feedback from supervisors",
      icon: "list",
      onClick: () => router.push("/student-dashboard/evaluation"),
    },
  ];

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <div className="space-y-6">
        <main className="container mx-auto p-4 max-w-7xl mt-10">
          {/* ✅ Header With Student Name */}
          <div className="bg-[rgb(21,21,21)] text-white p-6 rounded mb-8">
            <h2 className="text-2xl font-semibold">Good Evening, {userName}</h2>
          </div>

          {/* Step Cards */}
          <div className="container mx-auto px-18 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step) => (
                <StepCard
                  key={step.number}
                  number={step.number}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  onClick={step.onClick}
                />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}