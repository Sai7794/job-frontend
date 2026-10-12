/**
 * NotFoundPage.jsx
 *
 * 404 page — shown when navigating to an unknown URL.
 */
import { useNavigate } from 'react-router-dom'
import { ArrowLeftIcon } from '../components/Icons'

export default function NotFoundPage() {
  const navigate = useNavigate()

  return (
    <div className="page">
      <div className="container" style={{ textAlign: 'center', paddingTop: '4rem', maxWidth: 560 }}>
        <div className="card animate-in" style={{ padding: '3.5rem 2rem' }}>
          <div
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '5.5rem',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #818cf8 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              lineHeight: 1,
              marginBottom: '1rem',
              letterSpacing: '-0.04em'
            }}
          >
            404
          </div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.75rem' }}>Page Not Found</h1>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.975rem', lineHeight: 1.6 }}>
            The destination you&apos;re looking for doesn&apos;t exist, was removed, or has moved to a new route.
          </p>
          <button className="btn btn-primary btn-lg" onClick={() => navigate('/')}>
            <ArrowLeftIcon size={16} /> Return to Home
          </button>
        </div>
      </div>
    </div>
  )
}
