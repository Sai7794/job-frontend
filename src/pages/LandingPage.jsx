/**
 * LandingPage.jsx
 *
 * The public home page shown to unauthenticated users.
 * Features:
 * - Hero section with tagline and CTAs.
 * - Feature highlights section.
 * - How it works section.
 */
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LandingPage() {
  const { isLoggedIn, isCandidate, isRecruiter } = useAuth()

  return (
    <main>
      {/* ── Hero ───────────────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-badge animate-in">✨ Free to Use · Open Source</div>

          <h1 className="hero-title animate-in" style={{ animationDelay: '0.1s' }}>
            Find Your Next<br />
            <span className="highlight">Dream Job</span>
          </h1>

          <p className="hero-subtitle animate-in" style={{ animationDelay: '0.2s' }}>
            A modern job portal connecting talented candidates with top recruiters.
            Search thousands of opportunities, apply in seconds, and track every application.
          </p>

          <div className="hero-actions animate-in" style={{ animationDelay: '0.3s' }}>
            {isLoggedIn ? (
              isCandidate ? (
                <Link to="/jobs">
                  <button className="btn btn-primary btn-lg">Browse Jobs →</button>
                </Link>
              ) : (
                <Link to="/recruiter/jobs">
                  <button className="btn btn-primary btn-lg">My Dashboard →</button>
                </Link>
              )
            ) : (
              <>
                <Link to="/register">
                  <button className="btn btn-primary btn-lg">Get Started — It's Free</button>
                </Link>
                <Link to="/jobs">
                  <button className="btn btn-secondary btn-lg">Browse Jobs</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────── */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="page-title">Everything You Need</h2>
            <p className="page-subtitle">One platform for candidates and recruiters alike.</p>
          </div>

          <div className="grid-3 animate-in">
            <FeatureCard
              icon="🔍"
              title="Smart Job Search"
              desc="Filter by title, company, location, or salary. Find exactly what you're looking for."
            />
            <FeatureCard
              icon="📋"
              title="One-Click Apply"
              desc="Apply to any open position instantly. No lengthy forms — just a single click."
            />
            <FeatureCard
              icon="📊"
              title="Track Applications"
              desc="Follow every application from APPLIED → SHORTLISTED → SELECTED in real time."
            />
            <FeatureCard
              icon="🏢"
              title="Post Jobs Easily"
              desc="Recruiters can create detailed job listings with salary ranges and required skills."
            />
            <FeatureCard
              icon="👥"
              title="Manage Applicants"
              desc="View all candidates for your postings and move them through your hiring pipeline."
            />
            <FeatureCard
              icon="🔒"
              title="Secure by Design"
              desc="JWT authentication, BCrypt password hashing, and role-based access control."
            />
          </div>
        </div>
      </section>

      {/* ── How it Works ───────────────────────────────────── */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <div className="container">
          <div className="text-center mb-6">
            <h2 className="page-title">How It <span>Works</span></h2>
          </div>
          <div className="grid-2">
            <div className="card animate-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--accent)' }}>
                👤 For Candidates
              </h3>
              <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Register an account as a <strong style={{ color: 'var(--text-primary)' }}>Candidate</strong></li>
                <li>Browse all available job openings</li>
                <li>Click <strong style={{ color: 'var(--text-primary)' }}>Apply</strong> on any open job</li>
                <li>Track your applications on the <strong style={{ color: 'var(--text-primary)' }}>My Applications</strong> page</li>
              </ol>
            </div>
            <div className="card animate-in">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--primary)' }}>
                🏢 For Recruiters
              </h3>
              <ol style={{ paddingLeft: '1.2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <li>Register an account as a <strong style={{ color: 'var(--text-primary)' }}>Recruiter</strong></li>
                <li>Post job listings with details, skills, and salary</li>
                <li>View all candidates who have applied</li>
                <li>Update each candidate's status: <strong style={{ color: 'var(--text-primary)' }}>SHORTLISTED, SELECTED,</strong> or <strong style={{ color: 'var(--text-primary)' }}>REJECTED</strong></li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            JobPortal — A College Resume Project · Built with Spring Boot &amp; React
          </p>
        </div>
      </footer>
    </main>
  )
}

/** Small reusable feature highlight card */
function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card">
      <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>{icon}</div>
      <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>{desc}</p>
    </div>
  )
}
