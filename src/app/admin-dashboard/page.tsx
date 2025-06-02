"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth, db, storage } from "../lib/firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { Navbar } from "../components/Navbar";
import DashboardHeader from "../components/dashboard-header";
import StepCard from "../components/admin-step-card";

export default function DashboardPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [documents, setDocuments] = useState<any[]>([]);
  const [userName, setUserName] = useState<string>("");

  const [studentCount, setStudentCount] = useState(0);
  const [supervisorCount, setSupervisorCount] = useState(0);
  const [projectCount, setProjectCount] = useState(0);

  const router = useRouter();

  // Auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) setUserEmail(user.email);
    });
    return () => unsubscribe();
  }, []);

  // Fetch uploaded documents
  useEffect(() => {
    const fetchDocs = async () => {
      const snapshot = await getDocs(collection(db, "student_documents"));
      const docs = snapshot.docs.map((doc) => doc.data());
      setDocuments(docs);
    };
    fetchDocs();
  }, []);

  // Upload file
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

  // Fetch counts from Firestore
  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const studentSnap = await getDocs(collection(db, "students"));
        const studentList = studentSnap.docs.map((doc) => doc.data());
        const uniqueEmails = new Set(studentList.map((student) => student.email));
        setStudentCount(uniqueEmails.size);

        const supervisorSnap = await getDocs(collection(db, "supervisors"));
        const projectSnap = await getDocs(collection(db, "projects"));

        setSupervisorCount(supervisorSnap.size);
        setProjectCount(projectSnap.size);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };

    fetchCounts();
  }, []);

  const steps = [
    {
      title: "Manage Students",
      description: "View and Manage students Account",
      icon: "user",
      label: "Total Students",
      count: studentCount,
      onClick: () => router.push("/admin-dashboard/manage-students"),
    },
    {
      title: "Manage Supervisors",
      description: "View and Manage Supervisor Accounts",
      icon: "layout",
      label: "Total Supervisors",
      count: supervisorCount,
      onClick: () => router.push("/admin-dashboard/manage-supervisors"),
    },
    {
      title: "Manage Projects",
      description: "View and Manage project Submissions",
      icon: "list",
      label: "Total Projects",
      count: projectCount,
      onClick: () => router.push("/admin-dashboard/project-submissions"),
    },
  ];

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
 <header className="bg-[rgb(21,21,21)] mt-25 text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
             <h2 className="text-2xl font-semibold text-white mb-2">
            {getGreeting()}, <span className="text-white">Administrator</span>
          </h2>

            <div className="bg-gray-300 p-2 rounded-full">
              {/* <FaUserGraduate className="h-6 w-6 text-[rgb(21,21,21)]" /> */}
            </div>
          </div>
        </header>
    

          <div className="container mx-auto px-18 py-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {steps.map((step: any) => (
                <StepCard
                  key={step.title}
                  title={step.title}
                  description={step.description}
                  icon={step.icon}
                  count={step.count}
                  label={step.label}
                  onClick={step.onClick}
                />
              ))}
            </div>
          </div>

    </div>
  );
}
