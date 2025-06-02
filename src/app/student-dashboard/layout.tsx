'use client';
import { useState } from 'react';
import { Navbar } from '../components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { FaUserLarge } from "react-icons/fa6";  
import { MdCreateNewFolder } from "react-icons/md";

import { FaProjectDiagram } from "react-icons/fa";
import { AiFillAndroid } from "react-icons/ai";
import { IoChatboxEllipses } from "react-icons/io5";
import { FaSignOutAlt } from "react-icons/fa";
import { AiFillDashboard } from "react-icons/ai";
import { TiGroup } from "react-icons/ti";
import { BsFileEarmarkCheckFill } from "react-icons/bs";
export default function StudentDashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/')
  };

  const menuItems = [
  { label: 'Dashboard', href: '/student-dashboard', icon: <AiFillDashboard /> },
  { label: 'My Profile', href: '/student-dashboard/profile', icon: <FaUserLarge /> },
  { label: 'Group Members', href: '/student-dashboard/group', icon: <TiGroup /> },
  { label: 'Create Project', href: '/student-dashboard/create-project', icon: <MdCreateNewFolder /> },
  { label: 'My Project', href: '/student-dashboard/my-project', icon: <FaProjectDiagram /> },
  { label: 'Evaluation', href: '/student-dashboard/evaluation', icon: <BsFileEarmarkCheckFill /> },

  // ✅ Just add this line for Messages
  { label: 'Messages', href: '/student-dashboard/messages', icon: <IoChatboxEllipses /> },

  { label: 'ChatBot', href: '/student-dashboard/chat-bot', icon: <AiFillAndroid  /> },
];

  return (
    <div className="flex min-h-screen">
      
      {/* Sidebar */}
      <aside className={`w-64 bg-gray-100 shadow-md p-4 h-screen fixed top-0 left-0  text-slate-400 text-md font-bold md:block ${isSidebarOpen ? 'block' : 'hidden'}`}>
        <h2 className="text-xl font-bold text-black mb-8 ">Student Dashboard</h2>
        <hr />
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`${
              pathname === item.href 
                ? 'bg-gray-200 text-black font-extrabold '  // Active item with gray background
                : 'text-gray-800 hover:bg-gray-300 hover:text-black'
            }  py-2 flex items-center mb-4 px-3 rounded-md`}  // Added px-3 for padding, rounded corners
          >
            <span className="mr-3">{item.icon}</span> {/* This ensures the icon and text are aligned side by side */}
            {item.label}
          </Link>
        ))}
        <hr />
        <button
          onClick={handleLogout}
          className="text-black hover:text-red-800 text-left mt-4 flex items-center"
        >
          <FaSignOutAlt className="mr-2" /> {/* Add margin to the icon for spacing */}
          Sign Out
        </button>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="md:hidden fixed top-4 left-4 p-2 text-black z-40"
      >
        ☰
      </button>

      {/* Main Content */}
      <main className="flex-1 bg-gray-50 p-8 ml-64 md:ml-0">{children}</main>
    </div>
  );
}
  