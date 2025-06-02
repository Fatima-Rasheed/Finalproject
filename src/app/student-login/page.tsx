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
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError('Please verify your email before logging in.');
        return;
      }

      router.push('/student-dashboard');
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold mb-6">Student Login</h2>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <label className="block mb-1 font-bold">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-2 border border-gray-300 rounded"
            placeholder="Enter your email"
            required
          />

          <label className="block mb-1 font-bold">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded"
              placeholder="Enter your password"
              required
            />
            <span
              className="absolute right-3 top-2 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              👁
            </span>
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-full bg-[rgb(21,21,21)] text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Login
          </button>

          <p className="text-sm text-center mt-4">
            Don't have an account?{' '}
            <a href="/student-signup" className="text-black font-medium hover:underline">
              Sign Up
            </a>
          </p>
        </form>
      </div>

      {/* Right Side */}
      <div className="w-1/2 bg-[rgb(21,21,21)] text-white flex flex-col justify-center items-center p-10">
        <h2 className="text-6xl font-bold mb-2">Welcome to</h2>
        <h3 className="text-3xl font-semibold mb-4">FYP Portal</h3>
        <p className="text-center text-gray-300 max-w-md mb-8">
          Manage your Final Year Project Seamlessly.
        </p>
        <img src="/illustration.png" alt="Illustration" className="w-72 h-72 object-cover" />
      </div>
    </div>
  );
}