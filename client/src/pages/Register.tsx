"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { z } from "zod"
import { useNavigate } from 'react-router-dom'

export const Register = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const registerSchema = z.object({
    email: z.string().email("Please enter a valid email address"),
    username: z.string().min(3, "Username must be at least 3 characters"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(6, "Password must be at least 6 characters"),
  }).refine(data => data.password === data.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  })

  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    const result = registerSchema.safeParse({ email, password, confirm_password: confirmPassword, username })
    if (!result.success) {
      setError(result.error.errors[0].message)
      setLoading(false)
      return
    }

    setError(null)
    setLoading(true)

    try {
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ email, password, username }),
      // })

      // if (!response.ok) {
      //   const data = await response.json()
      //   throw new Error(data.message)
      // }

      // const data = await response.json()
      // localStorage.setItem('token', data.token)
      localStorage.setItem('email', email)
      localStorage.setItem('password', password)
      localStorage.setItem('username', username)
      navigate('/')
    } catch (error: any) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
          />
        </div>
        <div>
          <Label htmlFor="username">Username</Label>
          <Input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
          />
        </div>
        <div>
          <Label htmlFor="confirm_password">Confirm Password</Label>
          <Input
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />
        </div>
        <div>
          <Button
            type="submit"
            disabled={loading}
          >
            Register
          </Button>
        </div>
        <div>
          {error && <p className="text-red-500">{error}</p>}
        </div>
      </form>
      <div className="mt-4 text-center">
        <Button variant="link" onClick={() => navigate('/login')}>
          Already have an account? Login
        </Button>
      </div>
    </div>
  )
}