/**
 * EditJobPage.jsx  (RECRUITER only)
 *
 * Loads the existing job data and renders the JobForm pre-filled.
 * - GETs /api/jobs/:id to load current data.
 * - PUTs /api/recruiter/jobs/:id with updated data.
 * - Navigates back to /recruiter/jobs on success.
 */
import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import api from '../../api/api'
import JobForm from '../../components/JobForm'

export default function EditJobPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [job, setJob]         = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    async function load() {
      try {
        const response = await api.get(`/jobs/${id}`)
        setJob(response.data)
      } catch {
        toast.error('Job not found.')
        navigate('/recruiter/jobs')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id, navigate])

  async function handleSubmit(data) {
    try {
      setSaving(true)
      await api.put(`/recruiter/jobs/${id}`, data)
      toast.success('Job updated successfully!')
      navigate('/recruiter/jobs')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update job.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="container spinner-wrapper"><div className="spinner" /></div>
      </div>
    )
  }

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 800 }}>
        <div className="page-header">
          <h1 className="page-title">Edit <span>Job Listing</span></h1>
          <p className="page-subtitle">Update the details of your job posting below.</p>
        </div>

        <div className="card animate-in">
          <JobForm
            initialData={job}
            onSubmit={handleSubmit}
            loading={saving}
            submitLabel="Save Changes →"
          />
        </div>
      </div>
    </div>
  )
}
