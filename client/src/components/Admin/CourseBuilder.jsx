// src/components/Admin/CourseBuilder.jsx
import { useState } from 'react';

const EMPTY_FORM = {
  code: '',
  title: '',
  description: '',
  credits: 3,
  maxCapacity: 30,
  semester: 'Spring 2026',
  meetingTime: '',
  location: '',
};

export default function CourseBuilder({ onSaveCourse }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [savedTitle, setSavedTitle] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSavedTitle(formData.title);
    onSaveCourse(formData);
    setFormData(EMPTY_FORM);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="course-builder">
      <h1>Course Builder</h1>

      {saved && (
        <div className="course-saved-banner">
           <strong>"{savedTitle}"</strong> has been created and added to the course list!
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="code">Course Code:</label>
            <input type="text" id="code" name="code" value={formData.code}
              onChange={handleChange} placeholder="e.g., CS401" required />
          </div>
          <div className="form-group">
            <label htmlFor="title">Course Title:</label>
            <input type="text" id="title" name="title" value={formData.title}
              onChange={handleChange} placeholder="e.g., Intro to AI" required />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea id="description" name="description" value={formData.description}
            onChange={handleChange} placeholder="Course description" rows="4" required />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits:</label>
            <input type="number" id="credits" name="credits" value={formData.credits}
              onChange={handleChange} min="1" max="6" required />
          </div>
          <div className="form-group">
            <label htmlFor="maxCapacity">Max Capacity:</label>
            <input type="number" id="maxCapacity" name="maxCapacity" value={formData.maxCapacity}
              onChange={handleChange} min="1" required />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="semester">Semester:</label>
            <select id="semester" name="semester" value={formData.semester} onChange={handleChange}>
              <option>Spring 2026</option>
              <option>Fall 2026</option>
              <option>Summer 2026</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="meetingTime">Meeting Time:</label>
            <input type="text" id="meetingTime" name="meetingTime" value={formData.meetingTime}
              onChange={handleChange} placeholder="e.g., MWF 10:00 AM" />
          </div>
          <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input type="text" id="location" name="location" value={formData.location}
              onChange={handleChange} placeholder="e.g., Room 201" />
          </div>
        </div>

        <button type="submit" className="btn-primary">Create Course</button>
      </form>
    </div>
  );
}
