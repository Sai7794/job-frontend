/**
 * RecruiterJobsPage.jsx  (RECRUITER only)
 *
 * Dashboard for a recruiter to manage their posted jobs.
 * - GETs /api/recruiter/jobs — lists only this recruiter's jobs.
 * - Edit button navigates to /recruiter/jobs/:id/edit.
 * - View Applicants navigates to /recruiter/jobs/:id/applicants.
 * - Close Job sends DELETE /api/recruiter/jobs/:id/close (updates status to CLOSED).
 * - Stats bar shows total, open, closed counts.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate, getJobStatusBadge } from '../../utils/formatters'

export default function RecruiterJobsPage() {
  const navigate = useNavigate()
  const [jobs, setJobs]       = useState([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState(null)

  async function loadJobs() {
    try {
      setLoading(true)
      const response = await api.get('/recruiter/jobs')
      setJobs(response.data)
    } catch {
      toast.error('Failed to load your jobs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadJobs() }, [])

  async function handleClose(jobId) {
    if (!window.confirm('Close this job? Candidates will no longer be able to apply.')) return
    try {
      setClosing(jobId)
      await api.patch(`/recruiter/jobs/${jobId}/close`)
      toast.success('Job closed successfully.')
      loadJobs()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not close job.')
    } finally {
      setClosing(null)
    }
  }

  const stats = {
    total:  jobs.length,
    open:   jobs.filter((j) => j.status === 'OPEN').length,
    closed: jobs.filter((j) => j.status === 'CLOSED').length,
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">My <span>Job Postings</span></h1>
            <p className="page-subtitle">Manage all the jobs you have posted.</p>
          </div>
          <Link to="/recruiter/jobs/new">
            <button className="btn btn-primary">+ Post New Job</button>
          </Link>
        </div>

        {/* Stats */}
        {!loading && jobs.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Jobs</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.open}</div>
              <div className="stat-label">Open</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.closed}</div>
              <div className="stat-label">Closed</div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading jobs…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No jobs posted yet</h3>
            <p>Post your first job listing to start receiving applications.</p>
            <Link to="/recruiter/jobs/new">
              <button className="btn btn-primary mt-4">Post a Job →</button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Posted</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => {
                  const { cls, label } = getJobStatusBadge(job.status)
                  return (
                    <tr key={job.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{job.title}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{job.location || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(job.createdAt)}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td>
                        <div className="flex gap-2">
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}
                          >
                            Applicants
                          </button>
                          <button
                            className="btn btn-secondary btn-sm"
                            onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
                          >
                            Edit
                          </button>
                          {job.status === 'OPEN' && (
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleClose(job.id)}
                              disabled={closing === job.id}
                            >
                              {closing === job.id ? '…' : 'Close'}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
