// src/components/Student/ProgressVisualization.jsx
import { useState, useEffect } from 'react';
import { loadGrades } from '../../utils/dataLoader';

export default function ProgressVisualization({ currentUser, courses = [] }) {
  const [chartData, setChartData] = useState([]);
  const [overallGPA, setOverallGPA] = useState(0);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const data = await loadGrades(currentUser.id);
        setOverallGPA(data.overallGPA || 0);

        const mapped = (data.courses || []).map(c => ({
          courseId: c.courseId,
          courseName: c.title || c.code,
          currentGrade: c.currentGrade || 'N/A',
          gpaPoints: c.gpaPoints || 0,
          assessmentCount: c.assessments?.length || 0,
          score: c.average || 0,
        }));
        setChartData(mapped);
      } catch (err) {
        console.error('Progress fetch error:', err);
      }
    };
    fetchGrades();
  }, [currentUser]);

  if (chartData.length === 0) {
    return (
      <div className="progress-visualization">
        <h1>Academic Progress</h1>
        <p>No grade data available.</p>
      </div>
    );
  }

  return (
    <div className="progress-visualization">
      <h1>Academic Progress</h1>

      <div className="progress-content">
        {/* Grade Cards */}
        <div className="grades-overview">
          <h2>Grades by Course</h2>
          <div className="grades-grid">
            {chartData.map(data => (
              <div key={data.courseId} className="grade-card">
                <h3>{data.courseName}</h3>
                <div className="grade-display">
                  <div className="grade-letter">{data.currentGrade}</div>
                  <div className="grade-info">
                    <p>GPA: {data.gpaPoints.toFixed(2)}</p>
                    <p>Assessments: {data.assessmentCount}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <p style={{ marginTop: '1rem' }}><strong>Overall GPA: {overallGPA.toFixed(2)}</strong></p>
        </div>

        {/* Progress Bars */}
        <div className="progress-bars">
          <h2>Performance Summary</h2>
          {chartData.map(data => (
            <div key={data.courseId} className="progress-item">
              <label>{data.courseName}</label>
              <div className="progress-bar-container">
                <div
                  className="progress-bar"
                  style={{ width: `${(data.gpaPoints / 4) * 100}%` }}
                />
              </div>
              <span>{((data.gpaPoints / 4) * 100).toFixed(1)}%</span>
            </div>
          ))}
        </div>

        {/* Bar Chart */}
        <div className="grade-chart-wrapper">
          <h2 className="chart-title">Course Performance Overview</h2>
          <div className="bar-chart">
            {chartData.map(data => (
              <div key={data.courseId} className="bar-container">
                <div className="grade-bar-wrapper">
                  <div
                    className="grade-bar"
                    style={{ height: `${data.score}%` }}
                  >
                    <span className="bar-score-text">{data.score}%</span>
                  </div>
                </div>
                <div className="bar-info">
                  <span className="course-name-label">{data.courseName}</span>
                  <span className="course-percentage">({data.currentGrade})</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
