/**
 * JobDetailPage.jsx
 *
 * Shows full details of a single job.
 * - GETs /api/jobs/:id
 * - Displays title, company, location, salary, experience, description, required skills.
 * - CANDIDATE sees an Apply button (if job is OPEN).
 * - Non-logged-in users see a "Login to Apply" button.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { formatSalary, formatDate } from '../utils/formatters'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, isCandidate } = useAuth()

  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [applying, setApplying] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/jobs/${id}`)
        setJob(response.data)
      } catch {
        toast.error('Job not found.')
        navigate('/jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleApply() {
    try {
      setApplying(true)
      await api.post(`/candidate/jobs/${id}/apply`)
      toast.success('Application submitted! 🎉')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container spinner-wrapper"><div className="spinner" /></div>
      </div>
    )
  }

  if (!job) return null

  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 760 }}>
        {/* Back button */}
        <button className="btn btn-secondary btn-sm mb-4" onClick={() => navigate('/jobs')}>
          ← Back to Jobs
        </button>

        <div className="card animate-in">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.2 }}>{job.title}</h1>
              <p style={{ color: 'var(--accent)', fontWeight: 600, marginTop: '0.3rem' }}>{job.companyName}</p>
            </div>
            <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`} style={{ fontSize: '0.8rem' }}>
              {job.status}
            </span>
          </div>

          {/* Meta info */}
          <div className="job-meta" style={{ marginBottom: '1.5rem', gap: '1rem' }}>
            {job.location  && <span className="job-meta-item" style={{ fontSize: '0.9rem' }}>📍 {job.location}</span>}
            {job.salary    && <span className="job-meta-item" style={{ fontSize: '0.9rem' }}>💰 {formatSalary(job.salary)} / yr</span>}
            {job.experience && <span className="job-meta-item" style={{ fontSize: '0.9rem' }}>🎓 {job.experience} years experience</span>}
            <span className="job-meta-item" style={{ fontSize: '0.9rem' }}>📅 Posted {formatDate(job.createdAt)}</span>
          </div>

          <div className="divider" />

          {/* Description */}
          {job.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Job Description</h2>
              <p style={{ color: 'var(--text-secondary)', lineHeight: 1.8, whiteSpace: 'pre-wrap', fontSize: '0.9rem' }}>
                {job.description}
              </p>
            </div>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Required Skills</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {skills.map((skill) => (
                  <span key={skill} className="pill" style={{ background: 'var(--primary-light)', color: '#a5b4fc' }}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="divider" />

          {/* CTA */}
          <div style={{ marginTop: '1.5rem' }}>
            {isCandidate && job.status === 'OPEN' ? (
              <button className="btn btn-primary btn-lg" onClick={handleApply} disabled={applying}>
                {applying ? 'Submitting…' : 'Apply for This Job ✨'}
              </button>
            ) : !isLoggedIn ? (
              <div>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontSize: '0.9rem' }}>
                  Log in as a Candidate to apply for this position.
                </p>
                <Link to="/login">
                  <button className="btn btn-primary">Login to Apply</button>
                </Link>
              </div>
            ) : job.status === 'CLOSED' ? (
              <p style={{ color: 'var(--danger)', fontWeight: 600 }}>This job is no longer accepting applications.</p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  )
}
