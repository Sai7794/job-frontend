/**
 * AuthContext.jsx — Global authentication state.
 *
 * Stores the logged-in user (id, name, role) and the JWT token.
 * Persists both to localStorage so the session survives page refreshes.
 *
 * Provides:
 *   - user       : object { id, name, email, role } or null
 *   - token      : JWT string or null
 *   - login(data): saves token + user from the auth response
 *   - logout()   : clears state and storage, redirects to /login
 *   - isCandidate: boolean helper
 *   - isRecruiter: boolean helper
 */
import { createContext, useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const navigate = useNavigate()

  // Initialize from localStorage so the user stays logged in on refresh
  const [token, setToken] = useState(() => localStorage.getItem('token'))
  const [user,  setUser]  = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })

  /**
   * Called after a successful login / register response.
   * @param {Object} data - the AuthResponse from the backend
   *   { token, id, name, email, role }
   */
  function login(data) {
    const userObj = {
      id:    data.id,
      name:  data.name,
      email: data.email,
      role:  data.role,
    }
    localStorage.setItem('token', data.token)
    localStorage.setItem('user',  JSON.stringify(userObj))
    setToken(data.token)
    setUser(userObj)
  }

  /** Clears all auth state and sends the user to the landing page. */
  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/login')
  }

  const value = {
    user,
    token,
    login,
    logout,
    isLoggedIn:   !!token,
    isCandidate:  user?.role === 'CANDIDATE',
    isRecruiter:  user?.role === 'RECRUITER',
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

/** Convenience hook — use inside any component inside AuthProvider. */
export function useAuth() {
  return useContext(AuthContext)
}
