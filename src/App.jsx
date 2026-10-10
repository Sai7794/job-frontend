/**
 * App.jsx — Root component.
 *
 * Sets up:
 * 1. AuthProvider  — global auth state (user, token, login, logout).
 * 2. React Router  — all application routes.
 *
 * Route strategy:
 * - Public routes: /, /login, /register, /jobs (read-only browse)
 * - Protected (any logged-in user): none extra
 * - Protected (CANDIDATE only): /my-applications
 * - Protected (RECRUITER only): /recruiter/*
 * - Catch-all /unauthorized and 404 pages.
 */
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import ProtectedRoute from './components/ProtectedRoute'

// Pages — public
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import JobListPage from './pages/JobListPage'
import JobDetailPage from './pages/JobDetailPage'

// Pages — candidate
import MyApplicationsPage from './pages/candidate/MyApplicationsPage'

// Pages — recruiter
import RecruiterJobsPage from './pages/recruiter/RecruiterJobsPage'
import PostJobPage from './pages/recruiter/PostJobPage'
import EditJobPage from './pages/recruiter/EditJobPage'
import RecruiterApplicationsPage from './pages/recruiter/RecruiterApplicationsPage'

// Misc pages
import UnauthorizedPage from './pages/UnauthorizedPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <AuthProvider>
      {/* Sticky navbar appears on every page */}
      <Navbar />

      <Routes>
        {/* ── Public routes ──────────────────────────── */}
        <Route path="/"         element={<LandingPage />} />
        <Route path="/login"    element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/jobs"     element={<JobListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />

        {/* ── Candidate-only routes ──────────────────── */}
        <Route element={<ProtectedRoute requiredRole="CANDIDATE" />}>
          <Route path="/my-applications" element={<MyApplicationsPage />} />
        </Route>

        {/* ── Recruiter-only routes ──────────────────── */}
        <Route element={<ProtectedRoute requiredRole="RECRUITER" />}>
          <Route path="/recruiter/jobs"              element={<RecruiterJobsPage />} />
          <Route path="/recruiter/jobs/new"          element={<PostJobPage />} />
          <Route path="/recruiter/jobs/:id/edit"     element={<EditJobPage />} />
          <Route path="/recruiter/jobs/:id/applicants" element={<RecruiterApplicationsPage />} />
        </Route>

        {/* ── Misc ──────────────────────────────────── */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/404"          element={<NotFoundPage />} />
        <Route path="*"             element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  )
}
