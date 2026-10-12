/**
 * LandingPage.jsx
 *
 * Professional home page for JobPortal.
 * - Hero section with live status badge, gradient headline, and dual CTAs.
 * - Metrics ribbon showcasing platform scale.
 * - Feature highlights with crisp SVG icons and glass cards.
 * - Stepped "How It Works" workflow for both Candidates and Recruiters.
 * - Professional footer.
 */
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
  SearchIcon,
  BriefcaseIcon,
  CheckCircleIcon,
  BuildingIcon,
  UserIcon,
  ShieldCheckIcon,
  TrendingUpIcon,
  ArrowRightIcon,
  SparklesIcon
} from '../components/Icons'

export default function LandingPage() {
  const { isLoggedIn, isCandidate, isRecruiter } = useAuth()

  return (
    <main>
      {/* ── Hero Section ───────────────────────────────────── */}
      <section className="hero">
        <div className="container">
          <div className="hero-pill animate-in">
            <span className="status-dot status-dot-green"></span>
            <span>Over 500+ Verified Roles Hiring Now</span>
          </div>

          <h1 className="hero-title animate-in" style={{ animationDelay: '0.08s' }}>
            Where Top Talent Meets<br />
            <span className="highlight">High-Growth Companies</span>
          </h1>

          <p className="hero-subtitle animate-in" style={{ animationDelay: '0.16s' }}>
            A streamlined recruitment platform connecting ambition with opportunity.
            Search curated openings, apply in one click, and track your interview journey in real time.
          </p>

          <div className="hero-actions animate-in" style={{ animationDelay: '0.24s' }}>
            {isLoggedIn ? (
              isCandidate ? (
                <Link to="/jobs">
                  <button className="btn btn-primary btn-lg">
                    Browse All Openings <ArrowRightIcon size={16} />
                  </button>
                </Link>
              ) : (
                <Link to="/recruiter/jobs">
                  <button className="btn btn-primary btn-lg">
                    Go to Recruiter Dashboard <ArrowRightIcon size={16} />
                  </button>
                </Link>
              )
            ) : (
              <>
                <Link to="/register">
                  <button className="btn btn-primary btn-lg">
                    Get Started Free <ArrowRightIcon size={16} />
                  </button>
                </Link>
                <Link to="/jobs">
                  <button className="btn btn-secondary btn-lg">
                    <SearchIcon size={16} /> Explore Openings
                  </button>
                </Link>
              </>
            )}
          </div>

          {/* ── Metrics Ribbon ─────────────────────────────────── */}
          <div className="metrics-ribbon animate-in" style={{ animationDelay: '0.32s' }}>
            <div className="metric-item">
              <div className="metric-number">500+</div>
              <div className="metric-label">Active Listings</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">12k+</div>
              <div className="metric-label">Qualified Candidates</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">&lt; 48h</div>
              <div className="metric-label">Avg. Recruiter Response</div>
            </div>
            <div className="metric-item">
              <div className="metric-number">98%</div>
              <div className="metric-label">Hiring Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Core Platform Features ─────────────────────────── */}
      <section style={{ padding: '3.5rem 0 4.5rem' }}>
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-purple mb-2">Built for Speed</span>
            <h2 className="page-title">Engineered for Modern <span>Hiring</span></h2>
            <p className="page-subtitle">Everything candidates and hiring managers need in one cohesive platform.</p>
          </div>

          <div className="grid-3">
            <FeatureCard
              icon={<SearchIcon size={22} />}
              title="Targeted Job Discovery"
              desc="Instant search by technology stack, compensation, experience level, and location with real-time keyword filtering."
            />
            <FeatureCard
              icon={<SparklesIcon size={22} />}
              title="One-Click Application"
              desc="Apply directly with your stored candidate profile. Zero redundant questionnaires or tedious external redirects."
            />
            <FeatureCard
              icon={<TrendingUpIcon size={22} />}
              title="Live Pipeline Tracking"
              desc="Follow your application status from Applied through Shortlisted and Selected with immediate dashboard updates."
            />
            <FeatureCard
              icon={<BuildingIcon size={22} />}
              title="Recruiter Command Center"
              desc="Post, edit, and manage job listings with rich skill tagging, compensation transparency, and applicant tracking."
            />
            <FeatureCard
              icon={<UserIcon size={22} />}
              title="Candidate Pipeline Review"
              desc="Review all applicants for your postings, view contact information, and update applicant statuses in a single click."
            />
            <FeatureCard
              icon={<ShieldCheckIcon size={22} />}
              title="Enterprise Grade Security"
              desc="Industry-standard JWT authentication, cryptographic BCrypt password hashing, and role-based access control."
            />
          </div>
        </div>
      </section>

      {/* ── How It Works Section ───────────────────────────── */}
      <section style={{ padding: '2rem 0 6rem' }}>
        <div className="container">
          <div className="text-center mb-8">
            <span className="badge badge-blue mb-2">Simple Workflow</span>
            <h2 className="page-title">How JobPortal <span>Works</span></h2>
            <p className="page-subtitle">A straightforward, transparent path from discovery to employment.</p>
          </div>

          <div className="grid-2">
            {/* Candidates */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)' }}>
                  <UserIcon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>For Candidates</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Find and secure your next role</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <StepItem
                  step="01"
                  title="Create Free Candidate Profile"
                  desc="Sign up in seconds and access the entire library of verified openings."
                />
                <StepItem
                  step="02"
                  title="Browse & Filter Roles"
                  desc="Filter by compensation, location, or stack to match your exact career goals."
                />
                <StepItem
                  step="03"
                  title="Apply & Monitor Progress"
                  desc="Submit applications with a single click and receive transparent real-time updates."
                />
              </div>
            </div>

            {/* Recruiters */}
            <div className="card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ width: 40, height: 40, borderRadius: 10, background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                  <BuildingIcon size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>For Recruiters</h3>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)' }}>Hire vetted talent efficiently</p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <StepItem
                  step="01"
                  title="Register as Recruiter"
                  desc="Set up your employer profile and gain instant publishing privileges."
                />
                <StepItem
                  step="02"
                  title="Publish Detailed Openings"
                  desc="Specify required skills, experience parameters, and salary ranges."
                />
                <StepItem
                  step="03"
                  title="Shortlist & Move Candidates"
                  desc="Review applicant profiles and transition candidates through your hiring stages."
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Call To Action Banner ──────────────────────────── */}
      <section style={{ padding: '0 0 5rem' }}>
        <div className="container">
          <div
            className="card text-center"
            style={{
              padding: '3.5rem 2rem',
              background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
              borderColor: 'rgba(99, 102, 241, 0.25)'
            }}
          >
            <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.75rem' }}>
              Ready to Advance Your Career?
            </h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '520px', margin: '0 auto 2rem', fontSize: '1.05rem' }}>
              Join thousands of professionals and top companies hiring on JobPortal today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register">
                <button className="btn btn-primary btn-lg">
                  Create Free Account <ArrowRightIcon size={16} />
                </button>
              </Link>
              <Link to="/jobs">
                <button className="btn btn-secondary btn-lg">
                  Browse Open Jobs
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────── */}
      <footer className="footer">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div className="navbar-logo-icon" style={{ width: 28, height: 28 }}>
                <BriefcaseIcon size={14} />
              </div>
              <span style={{ fontWeight: 800, letterSpacing: '-0.02em', fontSize: '1.1rem' }}>JobPortal</span>
            </div>
            <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              <Link to="/jobs">Jobs</Link>
              <Link to="/login">Sign In</Link>
              <Link to="/register">Register</Link>
            </div>
          </div>
          <div className="footer-text">
            &copy; {new Date().getFullYear()} JobPortal. All rights reserved. Enterprise talent &amp; career platform.
          </div>
        </div>
      </footer>
    </main>
  )
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="card">
      <div style={{
        width: 44,
        height: 44,
        borderRadius: 12,
        background: 'rgba(99, 102, 241, 0.12)',
        border: '1px solid rgba(99, 102, 241, 0.25)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#818cf8',
        marginBottom: '1.25rem'
      }}>
        {icon}
      </div>
      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{title}</h3>
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.65 }}>{desc}</p>
    </div>
  )
}

function StepItem({ step, title, desc }) {
  return (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
      <div style={{
        fontFamily: 'var(--font-display)',
        fontWeight: 800,
        fontSize: '0.85rem',
        color: 'var(--primary)',
        background: 'rgba(99, 102, 241, 0.12)',
        padding: '0.3rem 0.6rem',
        borderRadius: 8,
        flexShrink: 0,
        marginTop: 2
      }}>
        {step}
      </div>
      <div>
        <h4 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>{title}</h4>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{desc}</p>
      </div>
    </div>
  )
}
