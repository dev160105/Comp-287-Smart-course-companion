// src/components/Admin/CourseBuilder.jsx
import { useState, useEffect } from 'react';
import api from '../../utils/api';

const EMPTY_FORM = {
  code: '',
  title: '',
  description: '',
  credits: 3,
  maxCapacity: 30,
  semester: 'Spring 2026',
  meetingTime: '',
  location: '',
  startDate: '',
  endDate: '',
};

export default function CourseBuilder({ onSaveCourse, editCourse }) {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [saved, setSaved] = useState(false);
  const [savedTitle, setSavedTitle] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (editCourse) {
      setIsEditMode(true);
      setFormData({
        code: editCourse.code || '',
        title: editCourse.title || '',
        description: editCourse.description || '',
        credits: editCourse.credits || 3,
        maxCapacity: editCourse.maxCapacity || 30,
        semester: editCourse.semester || 'Spring 2026',
        meetingTime: editCourse.meetingTime || '',
        location: editCourse.location || '',
        startDate: editCourse.startDate || '',
        endDate: editCourse.endDate || '',
      });
    } else {
      setIsEditMode(false);
      setFormData(EMPTY_FORM);
    }
  }, [editCourse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSavedTitle(formData.title);

    if (isEditMode && editCourse) {
      // Update existing course
      try {
        const courseId = editCourse._id || editCourse.id;
        await api.put(`/api/courses/${courseId}`, {
          title: formData.title,
          description: formData.description,
          credits: Number(formData.credits),
          maxCapacity: Number(formData.maxCapacity),
          semester: formData.semester,
          meetingTime: formData.meetingTime || 'TBD',
          location: formData.location || 'TBD',
          startDate: formData.startDate || '',
          endDate: formData.endDate || '',
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
        // Navigate back to course manager — in edit mode we already saved via API
        if (onSaveCourse) {
          onSaveCourse(formData);
        }
      } catch (err) {
        console.error('Failed to update course:', err);
      }
    } else {
      // Create new course
      onSaveCourse(formData);
      setFormData(EMPTY_FORM);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  };

  return (
    <div className="course-builder">
      <h1>{isEditMode ? 'Edit Course' : 'Course Builder'}</h1>

      {saved && (
        <div className="course-saved-banner">
           <strong>"{savedTitle}"</strong> has been {isEditMode ? 'updated' : 'created and added to the course list'}!
        </div>
      )}

      <form onSubmit={handleSubmit} className="course-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="code">Course Code:</label>
            <input type="text" id="code" name="code" value={formData.code}
              onChange={handleChange} placeholder="e.g., CS401" required
              disabled={isEditMode} />
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
              <option>Spring 2025</option>
              <option>Fall 2025</option>
              <option>Summer 2025</option>
              <option>Spring 2026</option>
              <option>Fall 2026</option>
              <option>Summer 2026</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="startDate">Start Date:</label>
            <input type="date" id="startDate" name="startDate" value={formData.startDate}
              onChange={handleChange} />
          </div>
          <div className="form-group">
            <label htmlFor="endDate">End Date:</label>
            <input type="date" id="endDate" name="endDate" value={formData.endDate}
              onChange={handleChange} />
          </div>
        </div>

        <div className="form-row">
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

        <div className="action-buttons">
          <button type="submit" className="btn-primary">
            {isEditMode ? 'Update Course' : 'Create Course'}
          </button>
        </div>
      </form>
    </div>
  );
}
