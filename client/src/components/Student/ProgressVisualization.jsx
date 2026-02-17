// src/components/Student/ProgressVisualization.jsx
import { useState, useEffect } from 'react';

export default function ProgressVisualization({ currentUser, grades }) {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    if (grades && grades.length > 0) {
      // Prepare data for visualization
      const courseGrades = grades.reduce((acc, grade) => {
        acc[grade.courseId] = {
          courseName: grade.courseId,
          currentGrade: grade.currentGrade,
          gpa: grade.gpa,
          assessmentCount: grade.assessments.length,
        };
        return acc;
      }, {});
      setChartData(courseGrades);
    }
  }, [grades]);

  return (
    <div className="progress-visualization">
      <h1>Academic Progress</h1>
      
      {chartData ? (
        <div className="progress-content">
          <div className="grades-overview">
            <h2>Grades by Course</h2>
            <div className="grades-grid">
              {Object.entries(chartData).map(([courseId, data]) => (
                <div key={courseId} className="grade-card">
                  <h3>{data.courseName}</h3>
                  <div className="grade-display">
                    <div className="grade-letter">{data.currentGrade}</div>
                    <div className="grade-info">
                      <p>GPA: {data.gpa.toFixed(2)}</p>
                      <p>Assessments: {data.assessmentCount}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="progress-bars">
            <h2>Performance Summary</h2>
            {Object.entries(chartData).map(([courseId, data]) => (
              <div key={courseId} className="progress-item">
                <label>{data.courseName}</label>
                <div className="progress-bar-container">
                  <div 
                    className="progress-bar" 
                    style={{ width: `${(data.gpa / 4) * 100}%` }}
                  ></div>
                </div>
                <span>{(data.gpa / 4 * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <p>No grade data available.</p>
      )}
    </div>
  );
}
