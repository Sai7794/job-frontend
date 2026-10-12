/**
 * RecruiterJobsPage.jsx  (RECRUITER only)
 *
 * Dashboard for a recruiter to manage their posted jobs.
 * - Stats KPI bar (Total, Open, Closed).
 * - Direct action to create new job (+ Post New Job).
 * - Management table with Quick View Applicants, Edit, and Close actions.
 */
import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate } from '../../utils/formatters'
import {
  BriefcaseIcon,
  PlusIcon,
  BuildingIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon
} from '../../components/Icons'

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

  useEffect(() => {
    loadJobs()
  }, [])

  async function handleClose(jobId) {
    if (!window.confirm('Close this job? Candidates will no longer be able to submit new applications.')) return
    try {
      setClosing(jobId)
      await api.patch(`/recruiter/jobs/${jobId}/close`)
      toast.success('Job listing closed successfully.')
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
        <div
          className="page-header"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.25rem'
          }}
        >
          <div>
            <span className="badge badge-purple mb-2">Employer Hub</span>
            <h1 className="page-title">
              Manage <span>Job Postings</span>
            </h1>
            <p className="page-subtitle">
              Monitor active roles, review applicants, and control listing visibility.
            </p>
          </div>

          <Link to="/recruiter/jobs/new">
            <button className="btn btn-primary btn-lg">
              <PlusIcon size={16} /> Post New Opening
            </button>
          </Link>
        </div>

        {/* Stats KPI Ribbon */}
        {!loading && jobs.length > 0 && (
          <div className="stats-bar animate-in">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Listings Posted</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#34d399' }}>
                {stats.open}
              </div>
              <div className="stat-label">Active / Receiving Applicants</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#f87171' }}>
                {stats.closed}
              </div>
              <div className="stat-label">Closed / Archived</div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading your postings…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-box">
              <BuildingIcon size={28} />
            </div>
            <h3>No jobs posted yet</h3>
            <p>
              Create your first job posting to start receiving verified candidate applications.
            </p>
            <Link to="/recruiter/jobs/new">
              <button className="btn btn-primary mt-4">
                <PlusIcon size={16} /> Create Opening
              </button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Job Title</th>
                  <th>Location</th>
                  <th>Posted On</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job, idx) => (
                  <tr key={job.id}>
                    <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                    <td>
                      <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>{job.title}</strong>
                      <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{job.companyName}</div>
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {job.location || 'Remote'}
                    </td>
                    <td style={{ color: 'var(--text-secondary)' }}>
                      {formatDate(job.createdAt)}
                    </td>
                    <td>
                      <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>
                        <span className={`status-dot ${job.status === 'OPEN' ? 'status-dot-green' : 'status-dot-red'}`}></span>
                        {job.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/applicants`)}
                          title="View candidate applications"
                        >
                          <UserIcon size={13} />
                          <span>Applicants</span>
                        </button>

                        <button
                          className="btn btn-secondary btn-sm"
                          onClick={() => navigate(`/recruiter/jobs/${job.id}/edit`)}
                          title="Edit job details"
                        >
                          Edit
                        </button>

                        {job.status === 'OPEN' && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleClose(job.id)}
                            disabled={closing === job.id}
                            title="Close this opening"
                          >
                            {closing === job.id ? '…' : 'Close'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
