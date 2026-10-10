/**
 * ProtectedRoute.jsx
 *
 * A wrapper component that guards routes requiring authentication.
 * If the user is not logged in, they are redirected to /login.
 * If a specific role is required (e.g. "RECRUITER"), unauthorized users
 * are redirected to /unauthorized.
 *
 * Usage:
 *   <Route element={<ProtectedRoute />}>
 *     <Route path="/dashboard" element={<Dashboard />} />
 *   </Route>
 *
 *   <Route element={<ProtectedRoute requiredRole="RECRUITER" />}>
 *     <Route path="/recruiter/jobs" element={<RecruiterJobs />} />
 *   </Route>
 */
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ requiredRole }) {
  const { isLoggedIn, user } = useAuth()

  // Not logged in at all → go to login page
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />
  }

  // Logged in but wrong role (e.g. CANDIDATE trying RECRUITER routes)
  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />
  }

  // All checks pass — render the child route
  return <Outlet />
}
