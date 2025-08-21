export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export class AuthService {
  private static instance: AuthService
  private token: string | null = null
  private backendUrl: string

  private constructor() {
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("token")
    }
    this.backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001"
  }

  static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService()
    }
    return AuthService.instance
  }

  getToken(): string | null {
    return this.token
  }

  setToken(token: string): void {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token)
    }
  }

  removeToken(): void {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("token")
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  async getCurrentUser(): Promise<User | null> {
    if (!this.token) return null

    try {
      const response = await fetch(`${this.backendUrl}/api/auth/me`, {
        headers: {
          Authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
        },
      })

      if (response.ok) {
        return await response.json()
      } else {
        this.removeToken()
        return null
      }
    } catch (error) {
      console.error("Failed to get current user:", error)
      return null
    }
  }

  async login(email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        this.setToken(data.token)
        return data
      } else {
        return null
      }
    } catch (error) {
      console.error("Login failed:", error)
      return null
    }
  }

  async register(name: string, email: string, password: string): Promise<AuthResponse | null> {
    try {
      const response = await fetch(`${this.backendUrl}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (response.ok) {
        const data: AuthResponse = await response.json()
        this.setToken(data.token)
        return data
      } else {
        return null
      }
    } catch (error) {
      console.error("Registration failed:", error)
      return null
    }
  }

  logout(): void {
    this.removeToken()
    window.location.href = "/"
  }
}
