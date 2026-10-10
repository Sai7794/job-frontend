/**
 * LoginPage.jsx
 *
 * Handles user login.
 * - POSTs { email, password } to POST /api/auth/login.
 * - On success, calls auth.login(response.data) which stores the token.
 * - Redirects: CANDIDATE → /jobs, RECRUITER → /recruiter/jobs.
 * - Shows validation error and server error messages.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')   // clear error on edit
  }

  async function handleSubmit(e) {
    e.preventDefault()

    // Basic client-side validation
    if (!form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', form)
      auth.login(response.data)
      toast.success(`Welcome back, ${response.data.name}!`)

      // Redirect based on role
      if (response.data.role === 'RECRUITER') {
        navigate('/recruiter/jobs')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid email or password.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-in">
        <h1>Welcome back 👋</h1>
        <p className="subtitle">Log in to your JobPortal account.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              className="form-input"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              placeholder="Your password"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            id="login-submit"
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log In →'}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  )
}
