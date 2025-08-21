"use client"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, type ChangeEvent, type FormEvent, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Github } from "lucide-react"
import { AuthService } from "@/lib/auth"

interface FormData {
  email: string
  password: string
  confirmPassword: string
  name: string
}

function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
  })

  const searchParams = useSearchParams()
  const router = useRouter()
  const mode = searchParams.get("mode")

  useEffect(() => {
    if (mode === "signup") {
      setIsLogin(false)
    }
  }, [mode])

  useEffect(() => {
    const testBackendConnection = async () => {
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
      console.log("[v0] Testing backend connection to:", API_BASE_URL)

      try {
        const response = await fetch(`${API_BASE_URL}/api/health`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        })

        if (response.ok) {
          console.log("[v0] Backend connection successful")
        } else {
          console.log("[v0] Backend responded with status:", response.status)
        }
      } catch (error) {
        console.error("[v0] Backend connection failed:", error)
        console.log("[v0] Make sure your backend server is running on", API_BASE_URL)
      }
    }

    testBackendConnection()
  }, [])

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: FormEvent<HTMLElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
    console.log("[v0] API Base URL:", API_BASE_URL)

    if (isLogin) {
      try {
        console.log("[v0] Attempting login with:", { email: formData.email })
        const res = await fetch(`${API_BASE_URL}/api/login`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        })

        console.log("[v0] Login response status:", res.status)
        const data = await res.json()
        console.log("[v0] Login response data:", data)

        if (!res.ok) {
          throw new Error(data.message || "Login failed")
        }

        const authService = AuthService.getInstance()
        console.log("[v0] Token from response:", data.token)
        authService.setToken(data.token)

        // Verify token was stored
        const storedToken = authService.getToken()
        console.log("[v0] Token stored successfully:", !!storedToken)
        console.log("[v0] Is authenticated after login:", authService.isAuthenticated())

        console.log("[v0] Login successful, redirecting to dashboard")
        router.push("/dashboard")
      } catch (error) {
        if (error instanceof Error) {
          console.error("[v0] Login error:", error.message)
          alert(error.message)
        } else {
          console.error("[v0] Unknown login error", error)
          alert("An unexpected error occurred during login")
        }
      } finally {
        setIsLoading(false)
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        alert("Passwords do not match")
        setIsLoading(false)
        return
      }

      try {
        console.log("[v0] Attempting signup with:", { name: formData.name, email: formData.email })
        const res = await fetch(`${API_BASE_URL}/api/onboarding`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.name,
            email: formData.email,
            password: formData.password,
          }),
        })

        console.log("[v0] Signup response status:", res.status)
        const data = await res.json()
        console.log("[v0] Signup response data:", data)

        if (!res.ok) {
          throw new Error(data.message || "Signup failed")
        }

        const authService = AuthService.getInstance()
        console.log("[v0] Token from response:", data.token)
        authService.setToken(data.token)

        // Verify token was stored
        const storedToken = authService.getToken()
        console.log("[v0] Token stored successfully:", !!storedToken)
        console.log("[v0] Is authenticated after signup:", authService.isAuthenticated())

        console.log("[v0] Signup successful, redirecting to dashboard")
        router.push("/dashboard")
      } catch (error) {
        if (error instanceof Error) {
          console.error("[v0] Signup error:", error.message)
          alert(error.message)
        } else {
          console.error("[v0] Unknown signup error", error)
          alert("An unexpected error occurred during signup")
        }
      } finally {
        setIsLoading(false)
      }
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setFormData({
      email: "",
      password: "",
      confirmPassword: "",
      name: "",
    })
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="p-6">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-black transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to home
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          {/* Form Card */}
          <div className="bg-white rounded-xl shadow-2xl border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-2xl font-bold text-black">SyncPAD</span>
              </div>
              <h1 className="text-2xl font-bold text-black mb-2">{isLogin ? "Welcome back" : "Create your account"}</h1>
              <p className="text-gray-600">
                {isLogin
                  ? "Sign in to continue collaborating with your team"
                  : "Join thousands of teams using SyncPAD for real-time collaboration"}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-black">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Enter your full name"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-black">
                  Email Address
                </Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your email"
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-black">
                  Password
                </Label>
                <Input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  disabled={isLoading}
                  className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-black">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required={!isLogin}
                    placeholder="Confirm your password"
                    disabled={isLoading}
                    className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      disabled={isLoading}
                    />
                    <Label htmlFor="remember-me" className="text-sm text-gray-700">
                      Remember me
                    </Label>
                  </div>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    disabled={isLoading}
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-black hover:bg-gray-900 text-white border-0 transition-all duration-200 hover:shadow-lg"
              >
                {isLoading
                  ? isLogin
                    ? "Signing In..."
                    : "Creating Account..."
                  : isLogin
                    ? "Sign In"
                    : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  onClick={toggleMode}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isLoading}
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>

            {/* Social Login Options */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="border-gray-200" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or continue with</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white border-gray-300 hover:bg-gray-50 text-black"
                  disabled={isLoading}
                >
                  <svg className="h-4 w-4 mr-2 text-red-500" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  <span className="text-black">Google</span>
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-white border-gray-300 hover:bg-gray-50 text-black"
                  disabled={isLoading}
                >
                  <Github className="h-4 w-4 mr-2 text-gray-800" />
                  <span className="text-black">GitHub</span>
                </Button>
              </div>
            </div>
          </div>

          {/* Features Preview */}
          <div className="mt-8 text-center">
            <h3 className="text-lg font-semibold text-black mb-4">Why teams choose SyncPAD</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="font-medium text-black mb-1 flex items-center justify-center">
                  <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                  Real-time Editing
                </div>
                <div>Collaborate instantly with your team</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="font-medium text-black mb-1 flex items-center justify-center">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                  Shared Whiteboard
                </div>
                <div>Draw and brainstorm together</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                <div className="font-medium text-black mb-1 flex items-center justify-center">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                  User Presence
                </div>
                <div>See who's online and active</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthPage
