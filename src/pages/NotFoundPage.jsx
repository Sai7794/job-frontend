/**
 * NotFoundPage.jsx
 *
 * 404 page — shown when navigating to an unknown URL.
 */
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '5rem' }}>
        <div style={{
          fontSize: '6rem',
          fontWeight: 800,
          background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          lineHeight: 1,
          marginBottom: '1rem',
        }}>
          404
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.75rem' }}>Page Not Found</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <button className="btn btn-primary" onClick={() => navigate('/')}>
          ← Back to Home
        </button>
      </div>
    </div>
  )
}
