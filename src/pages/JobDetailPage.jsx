/**
 * JobDetailPage.jsx
 *
 * Displays rich specifications and description for a single job opening.
 * - Header with company badge, title, and status indicator.
 * - Specs ribbon: Compensation, Location, Experience, Posted date.
 * - Required skills tags.
 * - Structured description.
 * - Direct Apply action for Candidates or Sign In prompts.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { formatSalary, formatDate } from '../utils/formatters'
import {
  ArrowLeftIcon,
  MapPinIcon,
  CurrencyIcon,
  GraduationCapIcon,
  CalendarIcon,
  SparklesIcon,
  BuildingIcon,
  CheckCircleIcon
} from '../components/Icons'

export default function JobDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isLoggedIn, isCandidate, isRecruiter } = useAuth()

  const [job, setJob]           = useState(null)
  const [loading, setLoading]   = useState(true)
  const [applying, setApplying] = useState(false)
  const [applied, setApplied]   = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/jobs/${id}`)
        setJob(response.data)
      } catch {
        toast.error('Job opening not found.')
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
      toast.success('Your application was submitted successfully! 🎉')
      setApplied(true)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not apply for this role.')
    } finally {
      setApplying(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container spinner-wrapper">
          <div className="spinner" />
          <span>Loading job specifications…</span>
        </div>
      </div>
    )
  }

  if (!job) return null

  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : []

  const initial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'J'

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 840 }}>
        {/* Navigation back */}
        <button
          className="btn btn-secondary btn-sm mb-4"
          onClick={() => navigate('/jobs')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeftIcon size={14} /> Back to Openings
        </button>

        {/* Main Job Card */}
        <div className="card animate-in">
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
              <div className="company-avatar" style={{ width: 56, height: 56, fontSize: '1.4rem' }}>
                {initial}
              </div>
              <div>
                <h1 style={{ fontSize: '1.85rem', fontWeight: 800, lineHeight: 1.2 }}>{job.title}</h1>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <BuildingIcon size={16} className="text-muted" />
                  <span style={{ color: 'var(--accent)', fontWeight: 600, fontSize: '1.05rem' }}>
                    {job.companyName}
                  </span>
                </div>
              </div>
            </div>

            <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`} style={{ padding: '0.35rem 0.95rem' }}>
              <span className={`status-dot ${job.status === 'OPEN' ? 'status-dot-green' : 'status-dot-red'}`}></span>
              {job.status}
            </span>
          </div>

          {/* Key Attributes Ribbon */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
              padding: '1.25rem',
              background: 'rgba(255, 255, 255, 0.025)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-lg)',
              marginBottom: '2rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                Compensation
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#38bdf8', fontSize: '1.05rem' }}>
                <CurrencyIcon size={16} />
                {job.salary ? formatSalary(job.salary) : 'Not specified'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                Location
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.975rem' }}>
                <MapPinIcon size={16} />
                {job.location || 'Remote'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                Experience
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.975rem' }}>
                <GraduationCapIcon size={16} />
                {job.experience !== undefined && job.experience !== null ? `${job.experience} years min.` : 'Open to all levels'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.25rem' }}>
                Posted On
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: 'var(--text-secondary)', fontSize: '0.975rem' }}>
                <CalendarIcon size={16} />
                {formatDate(job.createdAt)}
              </div>
            </div>
          </div>

          {/* Required Skills */}
          {skills.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
                Required Technologies &amp; Skills
              </h3>
              <div className="skills-list">
                {skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="skill-tag"
                    style={{ fontSize: '0.85rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-md)' }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Detailed Job Description */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem' }}>
              Role Description &amp; Responsibilities
            </h3>
            <div style={{ color: 'var(--text-primary)', lineHeight: 1.8, fontSize: '0.975rem', whiteSpace: 'pre-line' }}>
              {job.description}
            </div>
          </div>

          {/* Application CTA Bar */}
          <div
            style={{
              paddingTop: '1.75rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>
                {job.status === 'OPEN' ? 'Interested in this role?' : 'This role is currently closed'}
              </div>
              <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>
                {job.status === 'OPEN'
                  ? 'Your candidate profile will be shared directly with the recruiter.'
                  : 'Check back later or browse other available opportunities.'}
              </div>
            </div>

            <div>
              {isLoggedIn ? (
                isCandidate ? (
                  job.status === 'OPEN' ? (
                    <button
                      className="btn btn-primary btn-lg"
                      onClick={handleApply}
                      disabled={applying || applied}
                    >
                      {applied ? (
                        <>
                          <CheckCircleIcon size={18} /> Applied!
                        </>
                      ) : applying ? (
                        'Submitting…'
                      ) : (
                        <>
                          <SparklesIcon size={18} /> Apply for This Role
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="btn btn-secondary" disabled>
                      Closed
                    </button>
                  )
                ) : isRecruiter ? (
                  <span className="badge badge-purple">
                    Logged in as Recruiter
                  </span>
                ) : null
              ) : (
                <Link to="/login">
                  <button className="btn btn-primary btn-lg">
                    Log In to Apply →
                  </button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
