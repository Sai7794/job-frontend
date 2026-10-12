/**
 * Navbar.jsx
 *
 * Sticky top navigation bar.
 * - Shows brand logo/name on the left with custom gradient icon.
 * - Shows relevant links based on authentication state and user role.
 * - Candidate links: Browse Jobs, My Applications
 * - Recruiter links: My Jobs, Post Job
 * - Unauthenticated links: Login, Register
 * - User pill with role badge and logout button.
 */
import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BriefcaseIcon, UserIcon, BuildingIcon, PlusIcon, LogoutIcon } from './Icons'

export default function Navbar() {
  const { isLoggedIn, user, logout, isCandidate, isRecruiter } = useAuth()

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Brand */}
        <NavLink to="/" className="navbar-brand">
          <div className="navbar-logo-icon">
            <BriefcaseIcon size={18} />
          </div>
          <span>JobPortal</span>
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
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <PlusIcon size={14} /> Post a Job
                    </span>
                  </NavLink>
                </>
              )}

              {/* User info + role chip */}
              <div className="user-badge">
                {user?.role === 'RECRUITER' ? (
                  <BuildingIcon size={14} className="text-muted" />
                ) : (
                  <UserIcon size={14} className="text-muted" />
                )}
                <span>{user?.name}</span>
                <span className={`badge ${user?.role === 'RECRUITER' ? 'badge-purple' : 'badge-blue'}`} style={{ fontSize: '0.68rem', padding: '0.1rem 0.5rem' }}>
                  {user?.role}
                </span>
              </div>

              <button className="btn btn-secondary btn-sm" onClick={logout} title="Log out">
                <LogoutIcon size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/jobs"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Browse Jobs
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                Login
              </NavLink>
              <NavLink to="/register">
                <button className="btn btn-primary btn-sm">
                  Get Started →
                </button>
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
