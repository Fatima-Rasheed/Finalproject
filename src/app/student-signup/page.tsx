'use client';

import { useState } from 'react';
import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { collection, setDoc, doc } from 'firebase/firestore';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function StudentSignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      // Save user data in Firestore
      await setDoc(doc(db, 'students', userCredential.user.uid), {
        fullName,
        email,
        role: 'student',
        createdAt: new Date(),
      });

      await sendEmailVerification(userCredential.user);
      alert('Verification email sent. Please check your inbox.');
      router.push('/student-login');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
     <div className="flex h-screen">
    
     <div className="w-1/2 bg-white flex flex-col justify-center items-center p-10">
        <h1 className="text-3xl font-bold mb-6">Student Sign Up</h1>

        <div className="w-full max-w-md space-y-4">
          <div>
            <label className="block font-medium">Full Name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your name" />
          </div>

          <div>
            <label className="block font-medium">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" />
          </div>

          <div>
            <label className="block font-medium">Password</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                👁
              </span>
            </div>
          </div>

          <div>
            <label className="block font-medium">Confirm Password</label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
              <span
                className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                👁
              </span>
            </div>
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <Button onClick={handleSignUp} className="w-full bg-black text-white" disabled={loading}>
            {loading ? 'Signing Up...' : 'Sign Up'}
          </Button>

          <p className="text-center text-sm">
            Already registered?{' '}
            <a href="/student-login" className="text-black font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
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