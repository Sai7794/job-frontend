/**
 * JobForm.jsx — Shared form component for creating and editing jobs.
 *
 * Used by PostJobPage and EditJobPage.
 * Props:
 *   - initialData : object (empty for create, pre-filled for edit)
 *   - onSubmit    : async function (called with the cleaned form data)
 *   - loading     : boolean
 *   - submitLabel : string (button label)
 */
import { useState } from 'react'

export default function JobForm({ initialData = {}, onSubmit, loading, submitLabel = 'Submit' }) {
  const [form, setForm] = useState({
    title:          initialData.title          || '',
    companyName:    initialData.companyName    || '',
    location:       initialData.location       || '',
    description:    initialData.description    || '',
    requiredSkills: initialData.requiredSkills || '',
    salary:         initialData.salary         || '',
    experience:     initialData.experience     || '',
  })
  const [errors, setErrors] = useState({})

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
    setErrors({ ...errors, [e.target.name]: '' })
  }

  function validate() {
    const e = {}
    if (!form.title.trim())       e.title       = 'Job title is required.'
    if (!form.companyName.trim()) e.companyName = 'Company name is required.'
    if (!form.description.trim()) e.description = 'Description is required.'
    return e
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    await onSubmit({
      ...form,
      salary:     form.salary     ? parseFloat(form.salary)      : null,
      experience: form.experience ? parseInt(form.experience, 10) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-title">Job Title *</label>
          <input
            id="jf-title"
            className="form-input"
            name="title"
            placeholder="e.g. Software Engineer"
            value={form.title}
            onChange={handleChange}
          />
          {errors.title && <span className="form-error">{errors.title}</span>}
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-company">Company Name *</label>
          <input
            id="jf-company"
            className="form-input"
            name="companyName"
            placeholder="e.g. Google"
            value={form.companyName}
            onChange={handleChange}
          />
          {errors.companyName && <span className="form-error">{errors.companyName}</span>}
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-location">Location</label>
          <input
            id="jf-location"
            className="form-input"
            name="location"
            placeholder="e.g. Bengaluru / Remote"
            value={form.location}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-salary">Annual Salary (₹)</label>
          <input
            id="jf-salary"
            className="form-input"
            type="number"
            name="salary"
            placeholder="e.g. 1200000"
            value={form.salary}
            onChange={handleChange}
            min="0"
          />
        </div>
      </div>

      <div className="grid-2" style={{ marginBottom: '1.25rem' }}>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-experience">Min. Experience (years)</label>
          <input
            id="jf-experience"
            className="form-input"
            type="number"
            name="experience"
            placeholder="e.g. 2"
            value={form.experience}
            onChange={handleChange}
            min="0"
          />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="jf-skills">Required Skills</label>
          <input
            id="jf-skills"
            className="form-input"
            name="requiredSkills"
            placeholder="Java, React, MySQL (comma-separated)"
            value={form.requiredSkills}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="form-group" style={{ marginBottom: '1.75rem' }}>
        <label className="form-label" htmlFor="jf-description">Job Description *</label>
        <textarea
          id="jf-description"
          className="form-textarea"
          name="description"
          placeholder="Describe responsibilities, requirements, perks…"
          value={form.description}
          onChange={handleChange}
          rows={6}
        />
        {errors.description && <span className="form-error">{errors.description}</span>}
      </div>

      <button id="jf-submit" className="btn btn-primary btn-lg" type="submit" disabled={loading}>
        {loading ? 'Saving…' : submitLabel}
      </button>
    </form>
  )
}
