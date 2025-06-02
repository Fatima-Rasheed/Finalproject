// src/app/student-dashboard/page.tsx
"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db } from "../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { storage } from "../lib/firebase";
import { Navbar } from "../components/Navbar";
import DashboardHeader from "../components/dashboard-header";

import StepCard from "../components/step-card";


export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
   const router = useRouter();

  // Fetching user email when auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  // Fetching documents from Firestore
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

  const userInitials = userEmail ? userEmail[0].toUpperCase() : "U";
  const [userName, setUserName] = useState<string>("");

  // Steps definition
  const steps = [
    {
      number: 1,
      title: "Complete Your Profile",
      description: "Update your personal information and expertise",
      icon: "user",
onClick: () => router.push("/supervisor-dashboard/profile")    },
    {
      number: 2,
      title: "Check Project Requests",
      description: "Review and approve student project proposals",
      icon: "layout",
           onClick: () => router.push("/supervisor-dashboard/requests")
    },
    {
      number: 3,
      title: "Follow Up Your Project",
      description: "Monitor progress and provide feedback to students",
      icon: "list",
      
  onClick: () => router.push("/supervisor-dashboard/evaluation")
    },
  ];
 // Use the router from next/navigation

  const handleNavigation = () => {
    
    router.push("/profile"); // Navigate to the /profile page
  }; 
  return (
    <div className="flex flex-col flex-1 md:ml-64">
      {/* Navbar */}
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <div className="space-y-6">
        {/* Topbar */}
        <main className="container mx-auto p-4 max-w-7xl mt-10">
          <div className="flex justify-between items-center mb-4">
           
          </div>

          {/* Dashboard Header */}
          <DashboardHeader userName={userName} />

          {/* Step Cards */}
     <div className="container mx-auto px-18 py-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4"> {/* Increased gap for more spacing */}
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

