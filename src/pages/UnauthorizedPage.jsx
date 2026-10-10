/**
 * UnauthorizedPage.jsx
 *
 * Shown when a logged-in user tries to access a route that requires
 * a different role (e.g. CANDIDATE visiting a RECRUITER page).
 */
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  const { isCandidate } = useAuth()

  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🚫</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: 400, margin: '0 auto 2rem' }}>
          You don&apos;t have permission to view this page. This area is restricted to a different user role.
        </p>
        <button
          className="btn btn-primary"
          onClick={() => navigate(isCandidate ? '/jobs' : '/recruiter/jobs')}
        >
          Go to My Dashboard →
        </button>
      </div>
    </div>
  )
}
