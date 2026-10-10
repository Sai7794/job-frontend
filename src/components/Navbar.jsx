/**
 * Navbar.jsx
 *
 * Sticky top navigation bar.
 * - Shows brand logo/name on the left.
 * - Shows relevant links based on authentication state and user role.
 * - Candidate links: Browse Jobs, My Applications
 * - Recruiter links: My Jobs, Post Job
 * - Unauthenticated links: Login, Register
 * - Always shows: the user's name and a Logout button when logged in.
 */
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isLoggedIn, user, logout, isCandidate, isRecruiter } = useAuth()

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          ⚡ JobPortal
        </NavLink>

        {/* Navigation links */}
        <div className="navbar-links">
          {isLoggedIn ? (
            <>
              {/* Candidate-specific links */}
              {isCandidate && (
                <>
                  <NavLink
                    to="/jobs"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Browse Jobs
                  </NavLink>
                  <NavLink
                    to="/my-applications"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    My Applications
                  </NavLink>
                </>
              )}

              {/* Recruiter-specific links */}
              {isRecruiter && (
                <>
                  <NavLink
                    to="/recruiter/jobs"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    My Jobs
                  </NavLink>
                  <NavLink
                    to="/recruiter/jobs/new"
                    className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  >
                    Post a Job
                  </NavLink>
                </>
              )}

              {/* User info + logout */}
              <span className="pill" style={{ marginLeft: '0.5rem' }}>
                {user?.role === 'RECRUITER' ? '🏢' : '👤'} {user?.name}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink to="/register">
                <button className="btn btn-primary btn-sm">Register</button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
