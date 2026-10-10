/**
 * formatters.js — Shared utility functions for formatting display values.
 */

/**
 * Formats a salary BigDecimal into a readable string.
 * e.g. 1200000 → "₹12,00,000"
 */
export function formatSalary(salary) {
  if (!salary) return null
  const num = parseFloat(salary)
  if (isNaN(num)) return salary
  return '₹' + num.toLocaleString('en-IN')
}

/**
 * Formats an ISO date string into a short human-readable form.
 * e.g. "2024-03-15T10:30:00" → "Mar 15, 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Returns the CSS badge class and a display label for an application status.
 * @param {string} status - e.g. "APPLIED", "SHORTLISTED", "SELECTED", "REJECTED"
 * @returns {{ cls: string, label: string }}
 */
export function getStatusBadge(status) {
  const map = {
    APPLIED:     { cls: 'badge-blue',   label: '📝 Applied' },
    SHORTLISTED: { cls: 'badge-yellow', label: '⭐ Shortlisted' },
    SELECTED:    { cls: 'badge-green',  label: '✅ Selected' },
    REJECTED:    { cls: 'badge-red',    label: '❌ Rejected' },
  }
  return map[status] || { cls: 'badge-gray', label: status }
}

/**
 * Returns the CSS badge class for a job status.
 */
export function getJobStatusBadge(status) {
  return status === 'OPEN'
    ? { cls: 'badge-green', label: '🟢 Open' }
    : { cls: 'badge-red',   label: '🔴 Closed' }
}
