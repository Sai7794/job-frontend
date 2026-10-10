/**
 * PostJobPage.jsx  (RECRUITER only)
 *
 * Form to post a new job listing.
 * - POSTs to /api/recruiter/jobs with job details.
 * - On success, navigates to /recruiter/jobs.
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import JobForm from '../../components/JobForm'

export default function PostJobPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(data) {
    try {
      setLoading(true)
      await api.post('/recruiter/jobs', data)
      toast.success('Job posted successfully! 🎉')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">Post a <span>New Job</span></h1>
          <p className="page-subtitle">Fill in the details below to publish your job listing.</p>
        </div>

        <div className="card animate-in">
          <JobForm
            onSubmit={handleSubmit}
            loading={loading}
            submitLabel="Publish Job Listing →"
          />
        </div>
      </div>
    </div>
  )
}
