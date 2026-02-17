// src/components/Admin/CourseBuilder.jsx
import { useState } from 'react';

export default function CourseBuilder({ onSaveCourse }) {
  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    credits: 3,
    instructor: '',
    maxCapacity: 100,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSaveCourse(formData);
    // Reset form
    setFormData({
      code: '',
      title: '',
      description: '',
      credits: 3,
      instructor: '',
      maxCapacity: 100,
    });
  };

  return (
    <div className="course-builder">
      <h1>Course Builder</h1>
      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="code">Course Code:</label>
            <input
              type="text"
              id="code"
              name="code"
              value={formData.code}
              onChange={handleChange}
              placeholder="e.g., CS101"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="title">Course Title:</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Introduction to Computer Science"
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Course description"
            rows="4"
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="credits">Credits:</label>
            <input
              type="number"
              id="credits"
              name="credits"
              value={formData.credits}
              onChange={handleChange}
              min="1"
              max="6"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="instructor">Instructor:</label>
            <input
              type="text"
              id="instructor"
              name="instructor"
              value={formData.instructor}
              onChange={handleChange}
              placeholder="Instructor ID"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="maxCapacity">Max Capacity:</label>
            <input
              type="number"
              id="maxCapacity"
              name="maxCapacity"
              value={formData.maxCapacity}
              onChange={handleChange}
              min="1"
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">Create Course</button>
      </form>
    </div>
  );
}
