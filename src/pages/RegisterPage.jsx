/**
 * RegisterPage.jsx
 *
 * Registration page with interactive visual role selection
 * (Candidate vs Recruiter), input validation, and sleek glass styling.
 */
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { BriefcaseIcon, UserIcon, BuildingIcon, ArrowRightIcon } from '../components/Icons'

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

  function handleRoleSelect(role) {
    setForm({ ...form, role })
    setError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }
    if (form.password.length < 6) {
      setError('Password must contain at least 6 characters.')
      return
    }

    try {
      setLoading(true)
      const response = await api.post('/auth/register', form)
      auth.login(response.data)
      toast.success(`Account created! Welcome, ${response.data.name}! 🚀`)

      if (response.data.role === 'RECRUITER') {
        navigate('/recruiter/jobs')
      } else {
        navigate('/jobs')
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed. Please check your details.'
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

        <h1>Create Your Account</h1>
        <p className="subtitle">Join thousands of job seekers and hiring teams.</p>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          {/* Interactive Role Selection */}
          <div>
            <label className="form-label mb-2" style={{ display: 'block' }}>I want to use JobPortal as a…</label>
            <div className="role-selector">
              <div
                className={`role-option ${form.role === 'CANDIDATE' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('CANDIDATE')}
              >
                <div style={{ color: form.role === 'CANDIDATE' ? '#818cf8' : 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>
                  <UserIcon size={22} />
                </div>
                <div className="role-option-title">Candidate</div>
                <div className="role-option-desc">Looking for opportunities</div>
              </div>

              <div
                className={`role-option ${form.role === 'RECRUITER' ? 'selected' : ''}`}
                onClick={() => handleRoleSelect('RECRUITER')}
              >
                <div style={{ color: form.role === 'RECRUITER' ? '#818cf8' : 'var(--text-muted)', display: 'flex', justifyContent: 'center' }}>
                  <BuildingIcon size={22} />
                </div>
                <div className="role-option-title">Recruiter</div>
                <div className="role-option-desc">Hiring top talent</div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="name">Full Name</label>
            <input
              id="name"
              className="form-input"
              type="text"
              name="name"
              placeholder="e.g. Alex Morgan"
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
              placeholder="name@example.com"
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

          {error && (
            <div className="form-error" style={{ background: 'rgba(239, 68, 68, 0.1)', padding: '0.65rem 0.9rem', borderRadius: 8, border: '1px solid rgba(239, 68, 68, 0.25)' }}>
              <span>⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <button
            id="register-submit"
            className="btn btn-primary btn-full btn-lg"
            type="submit"
            disabled={loading}
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? (
              'Creating Account…'
            ) : (
              <>
                Create Free Account <ArrowRightIcon size={16} />
              </>
            )}
          </button>
        </form>

        <p className="auth-footer">
          Already registered?{' '}
          <Link to="/login">Sign in here</Link>
        </p>
      </div>
    </div>
  )
}
