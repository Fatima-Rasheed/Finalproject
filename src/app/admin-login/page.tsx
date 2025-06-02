'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword } from 'firebase/auth'
// import { auth, db } from '../../firebaseConfig'
import { auth,db } from '@/firebase/config'
import { doc, getDoc } from 'firebase/firestore'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
    setLoading(true)
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      const user = result.user

      if (!user.emailVerified) {
        toast.error('Please verify your email before logging in.')
        setLoading(false)
        return
      }

      const docRef = doc(db, 'admins', user.uid)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists() && docSnap.data().role === 'admin') {
        toast.success('Login successful')
        router.push('/admin-dashboard')
      } else {
        toast.error('Access denied. Not an admin.')
      }
    } catch (err: any) {
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      {/* Left side - image and text */}
      <div className="hidden md:flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md px-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to <br /> FYP Portal</h1>
          <p className="text-gray-300 text-sm mb-6">
            Admin login for managing final year projects.
          </p>
          <img src="/illustration.png" alt="Illustration" className="w-full h-auto" />
        </div>
      </div>

      {/* Right side - login form */}
      <div className="flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">Admin Login</h2>

          <Input
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login as Admin'}
          </Button>

          {/* Sign up redirect */}
          <div className="text-center text-sm text-gray-600">
            Don&apos;t have an account?{' '}
            <button
              className="text-blue-600 underline"
              onClick={() => router.push('/admin-signup')}
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}