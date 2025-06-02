// src/app/student-login/page.tsx
'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';

export default function StudentLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/supervisor-dashboard');
    } catch (err: any) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Login form */}
      <div className=" font-family:Inter w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold mb-2">FYP Portal</h2>
        <p className="text-gray-600 mb-6">Login to your account</p>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <label className="block mb-1 font-sm font-bold">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[430px] text-sm mb-4 px-4 py-2 border border-gray-300 rounded  placeholder-gray-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-1 font-sm font-bold">Password</label>
          <div className="relative mb-4 ">
            <input 
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password" 
              className="  w-[430px] text-sm px-4 py-2 border border-gray-300 rounded placeholder-gray-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0   top-2 cursor-pointer"
            >
              👁️
            </span>
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-[430px] bg-[rgb(21,21,21)] text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </button>
           {/* Horizontal Line with "or" */}
          <div className="flex items-center w-full mt-4">
            <div className="border-t border-gray-300 flex-grow"></div>
            <span className="mx-6 text-gray-500 text-sm">or</span>
            <div className="border-t border-gray-300 flex-grow"></div>
          </div>


          <p className="text-sm text-center mt-4 text-gray-400">
            Don't have an account? <a href="/supervisor-signup" className="text-gray-600 text-sm border border-gray-400 rounded-md font-bold py-2 px-2 hover:underline">Sign up</a>
          </p>
        </form>
      </div>

      {/* Right side: Welcome + image */}
      <div className="w-1/2 bg-[rgb(21,21,21)] text-white flex flex-col justify-center items-center p-10">
        <h1 className="text-6xl font-bold mb-2">Welcome to</h1>
        <h2 className="text-3xl font-semibold mb-4">FYP Portal</h2>
        <p className="text-center text-gray-300 max-w-md mb-8">Manage your Final Year Project Seamlessly.</p>
        <img src="/illustration.png" alt="Illustration" className="w-72 h-72 object-cover " />
      </div>
    </div>
  );
}
