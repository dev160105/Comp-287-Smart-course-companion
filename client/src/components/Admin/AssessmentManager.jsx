import { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY_ASSESSMENT = {
  title: '',
  type: 'assignment',
  description: '',
  dueDate: '',
  maxPoints: 100,
  weight: 0,
  status: 'upcoming',
};

export default function AssessmentManager({ courses = [] }) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [formData, setFormData] = useState(EMPTY_ASSESSMENT);
  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchAssessments = async (courseId) => {
    if (!courseId) { setAssessments([]); return; }
    try {
      const res = await api.get(`/api/assessments/course/${courseId}`);
      setAssessments(res.data);
    } catch (err) {
      console.error('Failed to load assessments:', err);
    }
  };

  useEffect(() => {
    fetchAssessments(selectedCourseId);
  }, [selectedCourseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);
    try {
      if (editingId) {
        await api.put(`/api/assessments/${editingId}`, formData);
        setMessage('Assessment updated successfully');
      } else {
        await api.post('/api/assessments', { ...formData, courseId: selectedCourseId });
        setMessage('Assessment created successfully');
      }
      setFormData(EMPTY_ASSESSMENT);
      setEditingId(null);
      await fetchAssessments(selectedCourseId);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save assessment');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (assessment) => {
    setEditingId(assessment._id || assessment.id);
    setFormData({
      title: assessment.title,
      type: assessment.type,
      description: assessment.description || '',
      dueDate: assessment.dueDate || '',
      maxPoints: assessment.maxPoints,
      weight: assessment.weight || 0,
      status: assessment.status || 'upcoming',
    });
  };

  const handleDelete = async (assessmentId) => {
    if (!window.confirm('Delete this assessment? This will also remove all associated grades.')) return;
    try {
      await api.delete(`/api/assessments/${assessmentId}`);
      setMessage('Assessment deleted');
      await fetchAssessments(selectedCourseId);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to delete assessment');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setFormData(EMPTY_ASSESSMENT);
  };

  return (
    <div className="assessment-manager">
      <h1>Assessment Manager</h1>
      {message && <p className="info-text">{message}</p>}

      <div className="form-group">
        <label htmlFor="course-select">Select Course:</label>
        <select
          id="course-select"
          value={selectedCourseId}
          onChange={(e) => setSelectedCourseId(e.target.value)}
        >
          <option value="">-- Choose a course --</option>
          {courses.map(c => (
            <option key={c._id || c.id} value={c._id || c.id}>
              {c.code} - {c.title}
            </option>
          ))}
        </select>
      </div>

      {selectedCourseId && (
        <>
          <form onSubmit={handleSubmit} className="course-form" style={{ marginTop: '1.5rem' }}>
            <h2>{editingId ? 'Edit Assessment' : 'Create New Assessment'}</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="a-title">Title:</label>
                <input type="text" id="a-title" name="title" value={formData.title}
                  onChange={handleChange} placeholder="e.g., Midterm Exam" required />
              </div>
              <div className="form-group">
                <label htmlFor="a-type">Type:</label>
                <select id="a-type" name="type" value={formData.type} onChange={handleChange}>
                  <option value="assignment">Assignment</option>
                  <option value="quiz">Quiz</option>
                  <option value="lab">Lab</option>
                  <option value="exam">Exam</option>
                  <option value="project">Project</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="a-desc">Description:</label>
              <textarea id="a-desc" name="description" value={formData.description}
                onChange={handleChange} placeholder="Assessment description" rows="3" />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="a-due">Due Date:</label>
                <input type="date" id="a-due" name="dueDate" value={formData.dueDate}
                  onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label htmlFor="a-points">Max Points:</label>
                <input type="number" id="a-points" name="maxPoints" value={formData.maxPoints}
                  onChange={handleChange} min="1" required />
              </div>
              <div className="form-group">
                <label htmlFor="a-weight">Weight (%):</label>
                <input type="number" id="a-weight" name="weight" value={formData.weight}
                  onChange={handleChange} min="0" max="100" />
              </div>
              <div className="form-group">
                <label htmlFor="a-status">Status:</label>
                <select id="a-status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="upcoming">Upcoming</option>
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            <div className="action-buttons">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : editingId ? 'Update Assessment' : 'Create Assessment'}
              </button>
              {editingId && (
                <button type="button" className="btn-secondary" onClick={handleCancel}>Cancel</button>
              )}
            </div>
          </form>

          <div style={{ marginTop: '2rem' }}>
            <h2>Assessments for this Course ({assessments.length})</h2>
            {assessments.length === 0 ? (
              <p>No assessments yet. Create one above.</p>
            ) : (
              <table className="course-management-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Type</th>
                    <th>Due Date</th>
                    <th>Points</th>
                    <th>Weight</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assessments.map(a => (
                    <tr key={a._id || a.id}>
                      <td>{a.title}</td>
                      <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                      <td>{a.dueDate}</td>
                      <td>{a.maxPoints}</td>
                      <td>{a.weight || 0}%</td>
                      <td>
                        <span className={`status-badge ${a.status}`}>{a.status}</span>
                      </td>
                      <td>
                        <button className="btn-secondary" onClick={() => handleEdit(a)} style={{ marginRight: '0.5rem' }}>Edit</button>
                        <button className="btn-secondary" onClick={() => handleDelete(a._id || a.id)} style={{ color: '#ef4444' }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}
