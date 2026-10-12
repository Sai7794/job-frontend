/**
 * MyApplicationsPage.jsx  (CANDIDATE only)
 *
 * Candidate dashboard to monitor all submitted job applications.
 * - KPI stats summary (Total, Shortlisted, Selected, Rejected).
 * - Interactive applications table with color-coded status pills.
 * - Direct links to view the respective job openings.
 */
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate, getStatusBadge } from '../../utils/formatters'
import {
  BriefcaseIcon,
  CheckCircleIcon,
  ClockIcon,
  StarIcon,
  XCircleIcon,
  ArrowRightIcon
} from '../../components/Icons'

export default function MyApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading]           = useState(true)

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
          <span className="badge badge-blue mb-2">Candidate Portal</span>
          <h1 className="page-title">
            My Job <span>Applications</span>
          </h1>
          <p className="page-subtitle">
            Track your submission status and interview updates across all companies.
          </p>
        </div>

        {/* Stats KPI Ribbon */}
        {!loading && applications.length > 0 && (
          <div className="stats-bar animate-in">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Submissions</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#fbbf24' }}>
                {stats.shortlisted}
              </div>
              <div className="stat-label">Shortlisted for Review</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#34d399' }}>
                {stats.selected}
              </div>
              <div className="stat-label">Selected / Hired</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#f87171' }}>
                {stats.rejected}
              </div>
              <div className="stat-label">Not Selected</div>
            </div>
          </div>
        )}

        {/* Applications List */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading your application history…</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-box">
              <BriefcaseIcon size={28} />
            </div>
            <h3>No applications submitted yet</h3>
            <p>
              You haven&apos;t applied to any job openings yet. Start exploring active opportunities to launch your applications!
            </p>
            <Link to="/jobs">
              <button className="btn btn-primary">
                Browse Open Jobs <ArrowRightIcon size={16} />
              </button>
            </Link>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th>Job Opening</th>
                  <th>Hiring Company</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th style={{ textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => {
                  const badge = getStatusBadge(app.status)
                  return (
                    <tr key={app.id}>
                      <td>
                        <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                          {app.job?.title || 'Job Opening'}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--accent)', fontWeight: 600 }}>
                        {app.job?.companyName || '—'}
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(app.appliedAt)}
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`}>
                          {app.status === 'SELECTED' && <CheckCircleIcon size={14} />}
                          {app.status === 'SHORTLISTED' && <StarIcon size={14} />}
                          {app.status === 'APPLIED' && <ClockIcon size={14} />}
                          {app.status === 'REJECTED' && <XCircleIcon size={14} />}
                          <span>{app.status}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        {app.job?.id ? (
                          <Link to={`/jobs/${app.job.id}`}>
                            <button className="btn btn-secondary btn-sm">
                              View Role
                            </button>
                          </Link>
                        ) : (
                          <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>Listing archived</span>
                        )}
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
