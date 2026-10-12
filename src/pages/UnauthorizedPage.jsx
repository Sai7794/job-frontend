/**
 * UnauthorizedPage.jsx
 *
 * Shown when a logged-in user tries to access a route that requires
 * a different role (e.g. CANDIDATE visiting a RECRUITER page).
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ShieldCheckIcon, ArrowRightIcon } from '../components/Icons'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { isCandidate } = useAuth()

  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem', maxWidth: 560 }}>
        <div className="card animate-in" style={{ padding: '3.5rem 2rem' }}>
          <div
            className="empty-icon-box"
            style={{ width: 68, height: 68, color: '#f87171', background: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.25)' }}
          >
            <ShieldCheckIcon size={32} />
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Restricted Access</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.975rem', lineHeight: 1.6 }}>
            You do not have the required permissions to access this specific area. This dashboard is restricted to a different user role.
          </p>
          <button
            className="btn btn-primary btn-lg"
            onClick={() => navigate(isCandidate ? '/jobs' : '/recruiter/jobs')}
          >
            Return to Dashboard <ArrowRightIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
