/**
 * api.js — Axios instance configured for the Job Portal backend.
 *
 * - baseURL: '/api' (Vite dev proxy forwards to http://localhost:8080)
 * - Request interceptor: attaches JWT token from localStorage to every request.
 * - Response interceptor: logs 401 errors so we can redirect to login.
 */
import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
})

// ── Attach JWT token to outgoing requests ─────────────────────────
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`
  }
  return config
})

// ── Handle 401 Unauthorized: clear storage and redirect to login ──
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      // Only redirect if not already on auth pages
      if (!window.location.pathname.startsWith('/login') && !window.location.pathname.startsWith('/register')) {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  },
)

export default api
