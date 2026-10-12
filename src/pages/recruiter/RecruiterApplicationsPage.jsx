/**
 * RecruiterApplicationsPage.jsx  (RECRUITER only)
 *
 * Lists all applicants for a specific job, with the ability to update
 * each applicant's status (SHORTLISTED, SELECTED, REJECTED).
 */
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import { formatDate, getStatusBadge } from '../../utils/formatters'
import {
  ArrowLeftIcon,
  UserIcon,
  CheckCircleIcon,
  StarIcon,
  ClockIcon,
  XCircleIcon
} from '../../components/Icons'

const STATUS_OPTIONS = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED']

export default function RecruiterApplicationsPage() {
  const { id: jobId } = useParams()
  const navigate      = useNavigate()

  const [applications, setApplications] = useState([])
  const [jobTitle, setJobTitle]         = useState('')
  const [loading, setLoading]           = useState(true)
  const [updating, setUpdating]         = useState(null)

  useEffect(() => {
    async function load() {
      try {
        const jobResponse = await api.get(`/jobs/${jobId}`)
        setJobTitle(jobResponse.data.title)

        const appResponse = await api.get(`/recruiter/jobs/${jobId}/applications`)
        setApplications(appResponse.data)
      } catch {
        toast.error('Failed to load candidate applications.')
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
      setApplications((prev) =>
        prev.map((a) => (a.id === applicationId ? { ...a, status: newStatus } : a))
      )
      toast.success(`Candidate status moved to ${newStatus}`)
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
        {/* Navigation back */}
        <button
          className="btn btn-secondary btn-sm mb-4"
          onClick={() => navigate('/recruiter/jobs')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <ArrowLeftIcon size={14} /> Back to My Job Postings
        </button>

        {/* Header */}
        <div className="page-header">
          <span className="badge badge-purple mb-2">Applicant Pipeline</span>
          <h1 className="page-title">
            Candidates for <span>{jobTitle || 'Opening'}</span>
          </h1>
          <p className="page-subtitle">
            Review applicant profiles and transition candidates through your hiring stages.
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
              <div className="stat-label">Shortlisted Candidates</div>
            </div>

            <div className="stat-item">
              <div className="stat-value" style={{ color: '#34d399' }}>
                {stats.selected}
              </div>
              <div className="stat-label">Offers Extended / Hired</div>
            </div>
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span>Loading candidates…</span>
          </div>
        ) : applications.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-box">
              <UserIcon size={28} />
            </div>
            <h3>No applications received yet</h3>
            <p>
              Candidates applying to &quot;{jobTitle}&quot; will automatically appear here.
            </p>
          </div>
        ) : (
          <div className="table-wrapper animate-in">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 60 }}>#</th>
                  <th>Candidate</th>
                  <th>Contact Email</th>
                  <th>Applied Date</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'right' }}>Update Pipeline Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, idx) => {
                  const badge = getStatusBadge(app.status)
                  return (
                    <tr key={app.id}>
                      <td style={{ color: 'var(--text-muted)' }}>{idx + 1}</td>
                      <td>
                        <strong style={{ color: '#ffffff', fontSize: '0.95rem' }}>
                          {app.candidateName}
                        </strong>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        <a href={`mailto:${app.candidateEmail}`} style={{ color: '#38bdf8' }}>
                          {app.candidateEmail}
                        </a>
                      </td>
                      <td style={{ color: 'var(--text-secondary)' }}>
                        {formatDate(app.appliedAt)}
                      </td>
                      <td>
                        <span className={`badge ${badge.cls}`}>
                          {app.status === 'SELECTED' && <CheckCircleIcon size={13} />}
                          {app.status === 'SHORTLISTED' && <StarIcon size={13} />}
                          {app.status === 'APPLIED' && <ClockIcon size={13} />}
                          {app.status === 'REJECTED' && <XCircleIcon size={13} />}
                          <span>{app.status}</span>
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <select
                          className="form-select"
                          style={{
                            padding: '0.4rem 0.85rem',
                            fontSize: '0.825rem',
                            width: 'auto',
                            minWidth: 140,
                            display: 'inline-block'
                          }}
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          disabled={updating === app.id}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>
                              Move to: {s}
                            </option>
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
