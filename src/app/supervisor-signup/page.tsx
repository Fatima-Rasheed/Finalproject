'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';

export default function SupervisorSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // ✅ Set displayName in Firebase Auth
      await updateProfile(user, {
        displayName: fullName,
      });

      // ✅ Send email verification
      await sendEmailVerification(user);

      // ✅ Save supervisor data in Firestore
      await setDoc(doc(db, 'supervisors', user.uid), {
        fullName: fullName,
        email: user.email,
        department: 'Computer Science',
        phone: '+92 300 0000000',
        role: 'supervisor',
        createdAt: new Date().toISOString(),
      });

      // ✅ Sign out user after signup
      await auth.signOut();

      alert('Signup successful! A verification email has been sent. Please verify your email before logging in.');
      router.push('/supervisor-login');

    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side: Form */}
      <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h2 className="text-3xl font-bold mb-6">Supervisor Sign Up</h2>
        <form onSubmit={handleSignup} className="w-full max-w-sm">
          <label className="block mb-1 font-bold font-sm">Full Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="w-[430px] mb-4 px-4 py-2 border border-gray-300 rounded placeholder-gray-500 text-sm"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />

          <label className="block mb-1 font-bold font-sm">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-[430px] mb-4 px-4 py-2 border border-gray-300 rounded placeholder-gray-500 text-sm"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label className="block mb-1 font-bold font-sm">Password</label>
          <div className="relative mb-4">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Create password"
              className="w-[430px] px-3 py-2 border border-gray-300 rounded placeholder-gray-500 text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              👁
            </span>
          </div>

          <label className="block mb-1 font-bold font-sm">Confirm Password</label>
          <div className="relative mb-4">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className="w-[430px] px-4 py-2 border border-gray-300 rounded placeholder-gray-500 text-sm"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2 cursor-pointer"
            >
              👁
            </span>
          </div>

          {error && <p className="text-red-600 text-sm mb-2">{error}</p>}

          <button
            type="submit"
            className="w-[430px] bg-[rgb(21,21,21)] text-white py-2 rounded hover:bg-gray-800 transition"
          >
            Sign Up
          </button>

          <p className="text-sm text-center mt-4">
            Already registered?{' '}
            <a href="/supervisor-login" className="text-black font-medium hover:underline">
              Login
            </a>
          </p>
        </form>
      </div>

      {/* Right side: Welcome & Image */}
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
