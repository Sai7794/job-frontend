/**
 * JobListPage.jsx
 *
 * Public page — lists all OPEN jobs with search, category filtering,
 * and high-end job card presentation.
 */
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../api/api'
import { useAuth } from '../context/AuthContext'
import { formatSalary, formatDate } from '../utils/formatters'
import {
  SearchIcon,
  MapPinIcon,
  CurrencyIcon,
  GraduationCapIcon,
  CalendarIcon,
  ArrowRightIcon,
  SparklesIcon,
  BriefcaseIcon
} from '../components/Icons'

const QUICK_FILTERS = ['All', 'Remote', 'Frontend', 'Backend', 'Full Stack', 'Java', 'React', 'Engineer']

export default function JobListPage() {
  const { isCandidate } = useAuth()
  const navigate = useNavigate()

  const [jobs, setJobs]             = useState([])
  const [loading, setLoading]       = useState(true)
  const [keyword, setKeyword]       = useState('')
  const [activeFilter, setActiveFilter] = useState('All')
  const [applying, setApplying]     = useState(null)

  const loadJobs = useCallback(async (kw = '') => {
    try {
      setLoading(true)
      const url = kw.trim() ? `/jobs/search?keyword=${encodeURIComponent(kw)}` : '/jobs'
      const response = await api.get(url)
      setJobs(response.data)
    } catch {
      toast.error('Failed to load jobs.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Load all jobs on mount
  useEffect(() => {
    loadJobs()
  }, [loadJobs])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      loadJobs(keyword)
    }, 350)
    return () => clearTimeout(timer)
  }, [keyword, loadJobs])

  function handleFilterClick(filter) {
    setActiveFilter(filter)
    if (filter === 'All') {
      setKeyword('')
    } else {
      setKeyword(filter)
    }
  }

  async function handleApply(jobId) {
    try {
      setApplying(jobId)
      await api.post(`/candidate/jobs/${jobId}/apply`)
      toast.success('Application submitted successfully! 🎉')
    } catch (err) {
      const msg = err.response?.data?.message || 'Could not apply. Please try again.'
      toast.error(msg)
    } finally {
      setApplying(null)
    }
  }

  return (
    <div className="page">
      <div className="container">
        {/* Header */}
        <div className="page-header text-center" style={{ marginBottom: '2rem' }}>
          <span className="badge badge-blue mb-2">
            <span className="status-dot status-dot-green"></span>
            Live Openings
          </span>
          <h1 className="page-title">
            Explore <span>Open Opportunities</span>
          </h1>
          <p className="page-subtitle">
            Discover roles with top engineering teams and high-growth startups.
          </p>
        </div>

        {/* Enhanced Search & Filter Bar */}
        <div className="search-wrapper">
          <div className="search-inner">
            <div className="search-icon-box">
              <SearchIcon size={20} />
            </div>
            <input
              id="job-search"
              className="search-input"
              type="search"
              placeholder="Search by job title, company name, tech skills, or location…"
              value={keyword}
              onChange={(e) => {
                setKeyword(e.target.value)
                setActiveFilter('')
              }}
            />
            {keyword && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setKeyword('')
                  setActiveFilter('All')
                }}
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="filter-chips">
            {QUICK_FILTERS.map((filter) => (
              <button
                key={filter}
                className={`filter-chip ${activeFilter === filter || (filter === 'All' && !keyword) ? 'active' : ''}`}
                onClick={() => handleFilterClick(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Results Counter */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          <div>
            Showing <strong style={{ color: 'var(--text-primary)' }}>{jobs.length}</strong> available position{jobs.length !== 1 ? 's' : ''}
          </div>
          {keyword && (
            <span className="badge badge-purple">
              Filtered by: &quot;{keyword}&quot;
            </span>
          )}
        </div>

        {/* Jobs Grid */}
        {loading ? (
          <div className="spinner-wrapper">
            <div className="spinner" />
            <span style={{ fontSize: '0.95rem' }}>Loading current openings…</span>
          </div>
        ) : jobs.length === 0 ? (
          <div className="card empty-state">
            <div className="empty-icon-box">
              <BriefcaseIcon size={28} />
            </div>
            <h3>No matching roles found</h3>
            <p>
              {keyword
                ? `We couldn't find any positions matching "${keyword}". Try a broader term or reset the search.`
                : 'There are currently no open listings available. Please check back soon!'}
            </p>
            {keyword && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => {
                  setKeyword('')
                  setActiveFilter('All')
                }}
              >
                Reset Search
              </button>
            )}
          </div>
        ) : (
          <div className="jobs-grid">
            {jobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                isCandidate={isCandidate}
                applying={applying === job.id}
                onApply={() => handleApply(job.id)}
                onViewDetails={() => navigate(`/jobs/${job.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function JobCard({ job, isCandidate, applying, onApply, onViewDetails }) {
  // Extract initial character for company avatar
  const initial = job.companyName ? job.companyName.charAt(0).toUpperCase() : 'J'

  // Parse comma-separated skills
  const skills = job.requiredSkills
    ? job.requiredSkills.split(',').map((s) => s.trim()).filter(Boolean).slice(0, 4)
    : []

  return (
    <div className="job-card animate-in">
      <div className="job-card-header">
        <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
          <div className="company-avatar">{initial}</div>
          <div>
            <h2 className="job-title">{job.title}</h2>
            <p className="job-company">{job.companyName}</p>
          </div>
        </div>

        <span className={`badge ${job.status === 'OPEN' ? 'badge-green' : 'badge-red'}`}>
          <span className={`status-dot ${job.status === 'OPEN' ? 'status-dot-green' : 'status-dot-red'}`}></span>
          {job.status}
        </span>
      </div>

      <div className="job-meta">
        {job.location && (
          <span className="job-meta-item">
            <MapPinIcon size={13} /> {job.location}
          </span>
        )}
        {job.salary && (
          <span className="job-meta-item" style={{ color: '#38bdf8' }}>
            <CurrencyIcon size={13} /> {formatSalary(job.salary)}
          </span>
        )}
        {job.experience !== undefined && job.experience !== null && (
          <span className="job-meta-item">
            <GraduationCapIcon size={13} /> {job.experience} yr{job.experience !== 1 ? 's' : ''} exp
          </span>
        )}
        <span className="job-meta-item">
          <CalendarIcon size={13} /> {formatDate(job.createdAt)}
        </span>
      </div>

      {job.description && (
        <p className="job-description">{job.description}</p>
      )}

      {skills.length > 0 && (
        <div className="skills-list">
          {skills.map((skill, idx) => (
            <span key={idx} className="skill-tag">
              {skill}
            </span>
          ))}
        </div>
      )}

      <div className="job-card-footer">
        <button className="btn btn-secondary btn-sm" onClick={onViewDetails}>
          View Details
        </button>

        {isCandidate && job.status === 'OPEN' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onApply}
            disabled={applying}
          >
            {applying ? (
              'Submitting…'
            ) : (
              <>
                <SparklesIcon size={14} /> Quick Apply
              </>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
