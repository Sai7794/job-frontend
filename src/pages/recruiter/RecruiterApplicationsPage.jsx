/**
 * RecruiterApplicationsPage.jsx  (RECRUITER only)
 *
 * Lists all applicants for a specific job, with the ability to update
 * each applicant's status (SHORTLISTED, SELECTED, REJECTED).
 *
 * - GETs /api/recruiter/jobs/:id/applications.
 * - PUTs /api/recruiter/applications/:applicationId/status with { status }.
 * - Displays a dropdown per applicant for inline status update.
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate, getStatusBadge } from '../../utils/formatters'

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED']

export default function RecruiterApplicationsPage() {
  const { id: jobId } = useParams()
  const navigate      = useNavigate()

  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle]         = useState('')
  const [loading, setLoading]           = useState(true)
  const [updating, setUpdating]         = useState(null)  // applicationId being updated

  useEffect(() => {
    async function load() {
      try {
        // Load job title for the page heading
        const jobResponse = await api.get(`/jobs/${jobId}`)
        setJobTitle(jobResponse.data.title)

        // Load all applications for this job
        const appResponse = await api.get(`/recruiter/jobs/${jobId}/applications`)
        setApplications(appResponse.data)
      } catch {
        toast.error('Failed to load applicants.')
        navigate('/recruiter/jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [jobId, navigate])

  async function handleStatusChange(applicationId, newStatus) {
    try {
      setUpdating(applicationId)
      await api.patch(`/recruiter/applications/${applicationId}/status`, { status: newStatus })
      // Optimistically update the local list
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      )
      toast.success(`Status updated to ${newStatus}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not update status.')
    } finally {
      setUpdating(null)
    }
  }

  const stats = {
    total:       applications.length,
    shortlisted: applications.filter((a) => a.status === 'SHORTLISTED').length,
    selected:    applications.filter((a) => a.status === 'SELECTED').length,
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header">
          <button className="btn btn-secondary btn-sm mb-4" onClick={() => navigate('/recruiter/jobs')}>
            ← Back to My Jobs
          </button>
          <h1 className="page-title">Applicants for <span>{jobTitle || '…'}</span></h1>
          <p className="page-subtitle">Review candidates and update their hiring status.</p>
        </div>

        {/* Stats */}
        {!loading && applications.length > 0 && (
          <div className="stats-bar">
            <div className="stat-item">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Applicants</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--warning)' }}>{stats.shortlisted}</div>
              <div className="stat-label">Shortlisted</div>
            </div>
            <div className="stat-item">
              <div className="stat-value" style={{ color: 'var(--success)' }}>{stats.selected}</div>
              <div className="stat-label">Selected</div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading applicants…</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <h3>No applicants yet</h3>
            <p>Share your job listing to start receiving applications.</p>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Candidate Name</th>
                  <th>Email</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th>Update Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => {
                  const { cls, label } = getStatusBadge(app.status)
                  return (
                    <tr key={app.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{app.candidateName}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{app.candidateEmail}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{formatDate(app.appliedAt)}</td>
                      <td><span className={`badge ${cls}`}>{label}</span></td>
                      <td>
                        <select
                          className="form-select"
                          style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', width: 'auto' }}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          disabled={updating === app.id}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
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
