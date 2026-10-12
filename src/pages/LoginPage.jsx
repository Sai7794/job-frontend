/**
 * LoginPage.jsx
 *
 * Professional authentication form for JobPortal.
 * - Glassmorphic centered card with top brand mark.
 * - Form validation and error banner.
 * - Smooth button loading state.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { BriefcaseIcon, ArrowRightIcon } from '../components/Icons'

export default function LoginPage() {
  const navigate = useNavigate()
  const auth = useAuth()

  const [form, setForm]     = useState({ email: '', password: '' })
  const [error, setError]   = useState('')
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.email || !form.password) {
      setError('Please provide both your email address and password.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/login', form)
      auth.login(response.data)
      toast.success(`Welcome back, ${response.data.name}! 👋`)

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
        {/* Brand Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.5rem' }}>
          <div className="navbar-logo-icon">
            <BriefcaseIcon size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>JobPortal</span>
        </div>

        <h1>Welcome Back</h1>
        <p className="subtitle">Sign in to access your dashboard and opportunities.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Work or Personal Email</label>
            <input
              id="email"
              className="form-input"
              type="email"
              name="email"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              autoComplete="email"
              required
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className="form-label" htmlFor="password">Password</label>
            </div>
            <input
              id="password"
              className="form-input"
              type="password"
              name="password"
              placeholder="••••••••••••"
              value={form.password}
              onChange={handleChange}
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div className="form-error" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            id="login-submit"
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              'Authenticating…'
            ) : (
              <>
                Sign In to Account <ArrowRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Don&apos;t have an account yet?{' '}
          <Link to="/register">Create an account for free</Link>
        </p>
      </div>
    </div>
  )
}
