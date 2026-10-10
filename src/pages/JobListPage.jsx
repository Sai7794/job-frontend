/**
 * JobListPage.jsx
 *
 * Public page — lists all OPEN jobs with search/filter functionality.
 * - GETs /api/jobs (all open jobs).
 * - GETs /api/jobs/search?keyword=... when user types in search box.
 * - Each job card links to its detail page /jobs/:id.
 * - Shows an Apply button only when a logged-in CANDIDATE views the page.
 */
import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { formatSalary, formatDate, getStatusBadge } from '../utils/formatters'

export default function JobListPage() {
  const { isCandidate } = useAuth()
  const navigate = useNavigate()

  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [applying, setApplying] = useState(null)  // id of job being applied to

  const loadJobs = useCallback(async (kw = '') => {
    try {
      setLoading(true)
      const url = kw.trim() ? `/jobs/search?keyword=${encodeURIComponent(kw)}` : '/jobs'
      const response = await api.get(url)
      setJobs(response.data)
    } catch {
      toast.error('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load all jobs on mount
  useEffect(() => { loadJobs() }, [loadJobs])

  // Debounced search — wait 400ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => loadJobs(keyword), 400)
    return () => clearTimeout(timer)
  }, [keyword, loadJobs])

  async function handleApply(jobId) {
    try {
      setApplying(jobId)
      await api.post(`/candidate/jobs/${jobId}/apply`)
      toast.success('Application submitted! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not apply. Please try again.'
      toast.error(msg)
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">Browse <span>Open Jobs</span></h1>
          <p className="page-subtitle">
            {jobs.length} opening{jobs.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Search bar */}
        <div className="search-bar">
          <input
            id="job-search"
            className="form-input"
            type="search"
            placeholder="🔍  Search by title, company, location or skills…"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          {keyword && (
            <button className="btn btn-secondary" onClick={() => setKeyword('')}>
              Clear
            </button>
          )}
        </div>

        {/* Job grid */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading jobs…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">🗂️</div>
            <h3>No jobs found</h3>
            <p>{keyword ? 'Try a different search term.' : 'Check back later for new openings!'}</p>
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isCandidate={isCandidate}
                applying={applying === job.id}
                onApply={() => handleApply(job.id)}
                onViewDetails={() => navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job, isCandidate, applying, onApply, onViewDetails }) {
  return (
    <div className="job-card">
      <div className="job-card-header">
        <div>
          <h2 className="job-title">{job.title}</h2>
          <p className="job-company">{job.companyName}</p>
        </div>
        <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>
          {job.status}
        </span>
      </div>

      <div className="job-meta">
        {job.location && <span className="job-meta-item">📍 {job.location}</span>}
        {job.salary   && <span className="job-meta-item">💰 {formatSalary(job.salary)}</span>}
        {job.experience && <span className="job-meta-item">🎓 {job.experience} yrs exp</span>}
        <span className="job-meta-item">📅 {formatDate(job.createdAt)}</span>
      </div>

      {job.description && (
        <p className="job-description">{job.description}</p>
      )}

      <div className="job-card-footer">
        <button className="btn btn-secondary btn-sm" onClick={onViewDetails}>
          View Details
        </button>
        {isCandidate && job.status === 'OPEN' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onApply}
            disabled={applying}
          >
            {applying ? 'Applying…' : 'Apply Now ✨'}
          </button>
        )}
      </div>
    </div>
  )
}
