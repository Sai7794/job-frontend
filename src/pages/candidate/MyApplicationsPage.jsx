/**
 * MyApplicationsPage.jsx  (CANDIDATE only)
 *
 * Shows all applications submitted by the logged-in candidate.
 * - GETs /api/candidate/applications
 * - Displays job title, company, date applied, and current status.
 * - Status is color-coded: APPLIED (blue), SHORTLISTED (yellow), SELECTED (green), REJECTED (red).
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate, getStatusBadge } from '../../utils/formatters'

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get('/candidate/applications')
        setApplications(response.data)
      } catch {
        toast.error('Failed to load your applications.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  // Summary stats
  const stats = {
    total:       applications.length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    selected:    applications.filter((a) => a.status === 'SELECTED').length,
    rejected:    applications.filter((a) => a.status === 'REJECTED').length,
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <h1 className="page-title">My <span>Applications</span></h1>
          <p className="page-subtitle">Track every job application you've submitted.</p>
        </div>

        {/* Stats */}
        {!loading && applications.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Applied</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.shortlisted}</div>
              <div className="stat-label">Shortlisted</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.selected}</div>
              <div className="stat-label">Selected</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--danger)' }}>{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading applications…</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No applications yet</h3>
            <p>Start by browsing available jobs and clicking Apply.</p>
            <Link to="/jobs" style={{ marginTop: '1rem', display: 'inline-block' }}>
              <button className="btn btn-primary mt-4">Browse Jobs →</button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Job Title</th>
                  <th>Company</th>
                  <th>Applied On</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => {
                  const { cls, label } = getStatusBadge(app.status)
                  return (
                    <tr key={app.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td>
                        <Link
                          to={`/jobs/${app.jobId}`}
                          style={{ color: 'var(--text-primary)', fontWeight: 600 }}
                        >
                          {app.jobTitle}
                        </Link>
                      </td>
                      <td style={{ color: 'var(--accent)' }}>{app.companyName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(app.appliedAt)}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
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
