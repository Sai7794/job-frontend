/**
 * RegisterPage.jsx
 *
 * Handles new user registration.
 * - POSTs { name, email, password, role } to POST /api/auth/register.
 * - Role is chosen from a dropdown (CANDIDATE / RECRUITER).
 * - On success, calls auth.login() and redirects based on role.
 * - Shows server-side error messages (e.g. email already registered).
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const navigate = useNavigate()
  const auth = useAuth()

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'CANDIDATE',
  })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/register', form)
      auth.login(response.data)
      toast.success(`Account created! Welcome, ${response.data.name}!`)

      if (response.data.role === 'RECRUITER') {
        navigate('/recruiter/jobs')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please try again.'
      setError(msg)
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-card animate-in">
        <h1>Create Account 🚀</h1>
        <p className="subtitle">Join JobPortal — free forever.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              autoComplete="name"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email"
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
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password"
              className="form-input"
              type="password"
              name="password"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={handleChange}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="role">I am a…</label>
            <select
              id="role"
              className="form-select"
              name="role"
              value={form.role}
              onChange={handleChange}
            >
              <option value="CANDIDATE">👤 Candidate — looking for a job</option>
              <option value="RECRUITER">🏢 Recruiter — posting jobs</option>
            </select>
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            id="register-submit"
            className="btn btn-primary btn-full"
            type="submit"
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in here</Link>
        </p>
      </div>
    </div>
  )
}
