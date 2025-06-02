'use client';
import { useState, useEffect, useRef } from 'react';
import { auth, db } from '../../lib/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { FaProjectDiagram } from "react-icons/fa";
import { useRouter } from 'next/navigation';
import { Navbar } from '@/app/components/Navbar';
import { AiFillProject } from "react-icons/ai";
import { RiAdminFill } from "react-icons/ri";
import { MdDescription } from "react-icons/md";
import { FaUpload } from "react-icons/fa";
import { BsUpload } from "react-icons/bs";

interface Supervisor {
  id: string;
  fullName: string;
}

export default function CreateProjectPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [supervisor, setSupervisor] = useState('');
  const [description, setDescription] = useState('');
  const [supervisorsList, setSupervisorsList] = useState<Supervisor[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [groupLeaderName, setGroupLeaderName] = useState('');
  const [groupLeaderRoll, setGroupLeaderRoll] = useState('');
  const [groupMembers, setGroupMembers] = useState<string[]>([]);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const querySnapshot = await getDocs(collection(db, 'supervisors'));
      const supervisorsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        fullName: doc.data().fullName,
      }));
      setSupervisorsList(supervisorsData);
    };
    fetchSupervisors();

    const storedMembers = localStorage.getItem("groupMembers");
    if (storedMembers) {
      try {
        const parsed = JSON.parse(storedMembers);
        const namesOnly = parsed.map((m: { name: string }) => m.name);
        setGroupMembers(namesOnly);
      } catch (error) {
        console.error("Error parsing group members:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const supervisorName = supervisorsList.find(s => s.id === supervisor)?.fullName || '';

      // ✅ Store only one project document with full data
      await addDoc(collection(db, 'projects'), {
        name,
        type,
        supervisorId: supervisor,
        supervisor: supervisorName,
        description,
        createdBy: user.email, // required for student filtering
        groupLeader: {
          name: groupLeaderName,
          roll: groupLeaderRoll,
        },
        groupMembers,
        createdAt: new Date(),
        proposalFile: file ? file.name : null,
        status: 'Pending'
      });

      alert('Project created successfully');
      router.push('/student-dashboard/my-project');
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please try again.');
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleFileButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="flex flex-col flex-1 md:ml-64">
      <header className="fixed top-0 left-0 md:left-64 w-full md:w-[calc(100%-16rem)] z-20">
        <Navbar />
      </header>
      <main className="pt-20 p-20 pb-0">
        <header className="bg-[rgb(21,21,21)] text-white p-5 rounded-md mb-5">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-semibold">Project Creation Form</h1>
            <div className="bg-gray-300 p-2 rounded-full">
              <FaProjectDiagram className="h-6 w-6 text-[rgb(21,21,21)]" />
            </div>
          </div>
        </header>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="font-medium mb-1 flex items-center">
                <AiFillProject className="mr-2" />Project Title
              </label>
              <input value={name} onChange={(e) => setName(e.target.value)} className="w-full p-2 border rounded bg-gray-200" required />
            </div>
            <div>
              <label className="font-medium mb-1 flex items-center">
                <FaProjectDiagram className="mr-2" />Project Type
              </label>
              <select value={type} onChange={(e) => setType(e.target.value)} className="w-full p-2 border rounded bg-gray-200" required>
                <option value="">Select Type</option>
                <option value="Research">Research</option>
                <option value="Development">Development</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium mb-1 flex items-center">
                <RiAdminFill className="mr-2" /> Supervisor
              </label>
              <select value={supervisor} onChange={(e) => setSupervisor(e.target.value)} className="w-full p-2 border rounded bg-gray-200" required>
                <option value="">Select Supervisor</option>
                {supervisorsList.map((sup) => (
                  <option key={sup.id} value={sup.id}>{sup.fullName}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="font-medium flex items-center mb-1">
                <MdDescription className="mr-2" /> Description
              </label>
              <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="w-full p-2 border rounded bg-gray-200" required />
            </div>
          </div>

          <label className="font-medium mb-1 flex items-center">
            <FaUpload className="mr-2" /> Proposal
          </label>
          <div className="flex flex-col space-y-4 mb-7">
            <input ref={fileInputRef} type="file" onChange={handleFileChange} className="hidden" />
            <button type="button" onClick={handleFileButtonClick} className="bg-[rgb(21,21,21)] text-white py-2 px-6 rounded w-[260px] flex items-center hover:bg-gray-800">
              <BsUpload className="mr-6" /> Upload Proposal
            </button>
          </div>

          <button type="submit" className="bg-[rgb(21,21,21)] absolute right-25 text-white mb-8 py-2 px-6 rounded w-[200px]">
            Apply
          </button>
        </form>
      </main>
    </div>
  );
}
