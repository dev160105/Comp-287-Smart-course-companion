// src/components/Admin/GradeManager.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/api';

export default function GradeManager({ courses = [] }) {
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [assessments, setAssessments] = useState([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState('');
  const [grades, setGrades] = useState([]);
  const [enrolledStudents, setEnrolledStudents] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch assessments + enrolled students when course is selected
  useEffect(() => {
    if (!selectedCourseId) {
      setAssessments([]);
      setSelectedAssessmentId('');
      setEnrolledStudents([]);
      return;
    }
    const fetchData = async () => {
      try {
        const [assessRes, studentsRes] = await Promise.all([
          api.get(`/api/assessments/course/${selectedCourseId}`),
          api.get(`/api/courses/${selectedCourseId}/students`),
        ]);
        setAssessments(assessRes.data);
        setEnrolledStudents(studentsRes.data);
      } catch (err) {
        console.error('Failed to load course data:', err);
      }
    };
    fetchData();
  }, [selectedCourseId]);

  // Fetch grades when assessment is selected
  const fetchGrades = async () => {
    if (!selectedAssessmentId || !selectedCourseId) {
      setGrades([]);
      return;
    }
    setLoading(true);
    try {
      const gradesRes = await api.get('/api/grades');
      const filtered = gradesRes.data.filter(g => {
        const gCourseId = g.courseId?._id || g.courseId;
        const gAssessmentId = g.assessmentId?._id || g.assessmentId;
        return gCourseId === selectedCourseId && gAssessmentId === selectedAssessmentId;
      });
      setGrades(filtered);
    } catch (err) {
      console.error('Failed to load grades:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGrades();
  }, [selectedAssessmentId, selectedCourseId]);

  const getStudentGrade = (studentId) => {
    return grades.find(g => {
      const gStudentId = g.studentId?._id || g.studentId;
      return gStudentId === studentId;
    });
  };

  const handleScoreChange = async (studentId, score, feedback) => {
    setMessage('');
    try {
      await api.post('/api/grades', {
        assessmentId: selectedAssessmentId,
        studentId,
        score: score === '' ? null : Number(score),
        status: score !== '' ? 'completed' : 'pending',
        feedback: feedback || '',
      });
      setMessage('Grade saved successfully');
      await fetchGrades();
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to save grade');
    }
  };

  const selectedAssessment = assessments.find(a => (a._id || a.id) === selectedAssessmentId);

  return (
    <div className="grade-manager">
      <h1>Grade Manager</h1>
      {message && <p className="info-text">{message}</p>}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="gm-course">Select Course:</label>
          <select
            id="gm-course"
            value={selectedCourseId}
            onChange={(e) => { setSelectedCourseId(e.target.value); setSelectedAssessmentId(''); }}
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
          <div className="form-group">
            <label htmlFor="gm-assessment">Select Assessment:</label>
            <select
              id="gm-assessment"
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
            >
              <option value="">-- Choose an assessment --</option>
              {assessments.map(a => (
                <option key={a._id || a.id} value={a._id || a.id}>
                  {a.title} ({a.type}) - {a.maxPoints} pts
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {selectedCourseId && !selectedAssessmentId && enrolledStudents.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Enrolled Students ({enrolledStudents.length})</h2>
          <table className="course-management-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Major</th>
                <th>GPA</th>
              </tr>
            </thead>
            <tbody>
              {enrolledStudents.map(s => (
                <tr key={s._id}>
                  <td>{s.firstName} {s.lastName}</td>
                  <td>{s.email}</td>
                  <td>{s.major || '-'}</td>
                  <td>{s.gpa?.toFixed(2) || '0.00'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedAssessmentId && selectedAssessment && (
        <div style={{ marginTop: '1.5rem' }}>
          <h2>Grades for: {selectedAssessment.title}</h2>
          <p>
            <strong>Type:</strong> {selectedAssessment.type} |{' '}
            <strong>Max Points:</strong> {selectedAssessment.maxPoints} |{' '}
            <strong>Due:</strong> {selectedAssessment.dueDate}
          </p>

          {loading ? (
            <p>Loading...</p>
          ) : enrolledStudents.length === 0 ? (
            <p>No enrolled students found for this course.</p>
          ) : (
            <table className="course-management-table">
              <thead>
                <tr>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Score (/{selectedAssessment.maxPoints})</th>
                  <th>Percentage</th>
                  <th>Status</th>
                  <th>Feedback</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {enrolledStudents.map(student => {
                  const grade = getStudentGrade(student._id);
                  return (
                    <GradeRow
                      key={student._id}
                      student={student}
                      grade={grade}
                      maxPoints={selectedAssessment.maxPoints}
                      onSave={handleScoreChange}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

function GradeRow({ student, grade, maxPoints, onSave }) {
  const [score, setScore] = useState(grade?.score != null ? String(grade.score) : '');
  const [feedback, setFeedback] = useState(grade?.feedback || '');
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    setScore(grade?.score != null ? String(grade.score) : '');
    setFeedback(grade?.feedback || '');
  }, [grade]);

  const percentage = grade?.score != null ? Math.round((grade.score / maxPoints) * 100) : '-';

  const handleSave = () => {
    onSave(student._id, score, feedback);
    setEditing(false);
  };

  return (
    <tr>
      <td>{student.firstName} {student.lastName}</td>
      <td>{student.email}</td>
      <td>
        {editing ? (
          <input type="number" min="0" max={maxPoints} value={score}
            onChange={(e) => setScore(e.target.value)} style={{ width: '80px' }} />
        ) : (
          <span>{grade?.score != null ? `${grade.score}/${maxPoints}` : 'Not graded'}</span>
        )}
      </td>
      <td>{percentage}%</td>
      <td>{grade?.status || 'pending'}</td>
      <td>
        {editing ? (
          <input type="text" value={feedback} onChange={(e) => setFeedback(e.target.value)}
            placeholder="Feedback" style={{ width: '150px' }} />
        ) : (
          <span>{grade?.feedback || '-'}</span>
        )}
      </td>
      <td>
        {editing ? (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn-primary" onClick={handleSave}>Save</button>
            <button className="btn-secondary" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        ) : (
          <button className="btn-secondary" onClick={() => setEditing(true)}>
            {grade?.score != null ? 'Edit' : 'Grade'}
          </button>
        )}
      </td>
    </tr>
  );
}
