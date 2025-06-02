'use client'

import { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth,db } from '@/firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'react-hot-toast'
import { EyeIcon, EyeOffIcon } from 'lucide-react'

export default function AdminSignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCred.user

      // 🔍 Debug log
      console.log("User created:", user.email)

      // Firestore entry
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        role: 'admin',
      })

      // Email verification
      await sendEmailVerification(user, {
        url: `${window.location.origin}/admin-login`,
      })

      toast.success('Verification email sent. Please check your inbox.')
      router.push('/admin-login')
    } catch (err: any) {
      console.error("Signup error:", err)
      toast.error(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-white">
      <div className="hidden md:flex items-center justify-center bg-black text-white">
        <div className="text-center max-w-md px-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to <br /> FYP Portal</h1>
          <p className="text-gray-300 text-sm mb-6">
            Admin signup for managing final year projects.
          </p>
          <img src="/illustration.png" alt="Illustration" className="w-full h-auto" />
        </div>
      </div>

      <div className="flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold text-center">Admin Signup</h2>

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

          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-2.5 cursor-pointer"
            >
              {showConfirmPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
            </div>
          </div>

          <Button
            className="w-full"
            onClick={handleSignup}
            disabled={loading}
          >
            {loading ? 'Creating account...' : 'Sign Up as Admin'}
          </Button>
        </div>
      </div>
    </div>
  )
}