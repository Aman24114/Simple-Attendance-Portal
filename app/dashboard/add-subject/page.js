'use client';
import { useState, useEffect } from 'react';
import styles from './add-subject.module.css';

export default function AddSubjectPage() {
  const [formData, setFormData] = useState({
    subjectCode: '',
    subjectName: '',
    department: '',
    semester: '',
    credits: '',
    professor: '',
    academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
  });
  const [professors, setProfessors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchProfessors();
  }, []);

  const fetchProfessors = async () => {
    try {
      const response = await fetch('/api/dashboard/professors');
      if (response.ok) {
        const data = await response.json();
        setProfessors(data.professors || []);
      }
    } catch (error) {
      console.error('Error fetching professors:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch('/api/dashboard/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setMessage('Subject added successfully!');
        setFormData({
          subjectCode: '',
          subjectName: '',
          department: '',
          semester: '',
          credits: '',
          professor: '',
          academicYear: new Date().getFullYear() + '-' + (new Date().getFullYear() + 1)
        });
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add subject');
      }
    } catch (error) {
      setMessage('Failed to add subject');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add New Subject</h1>
        <p>Create a new subject in the system</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="subjectCode">Subject Code *</label>
              <input
                type="text"
                id="subjectCode"
                name="subjectCode"
                value={formData.subjectCode}
                onChange={handleInputChange}
                required
                placeholder="e.g., CS101"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="subjectName">Subject Name *</label>
              <input
                type="text"
                id="subjectName"
                name="subjectName"
                value={formData.subjectName}
                onChange={handleInputChange}
                required
                placeholder="e.g., Data Structures"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="department">Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Department</option>
                <option value="CSE">CSE</option>
                <option value="ECE">ECE</option>
                <option value="ME">ME</option>
                <option value="CE">CE</option>
                <option value="EE">EE</option>
                <option value="MME">MME</option>
                <option value="PIE">PIE</option>
                <option value="CHE">CHE</option>
                <option value="Mining">Mining</option>
                <option value="Metallurgy">Metallurgy</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="semester">Semester *</label>
              <select
                id="semester"
                name="semester"
                value={formData.semester}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Semester</option>
                <option value="1">1st Semester</option>
                <option value="2">2nd Semester</option>
                <option value="3">3rd Semester</option>
                <option value="4">4th Semester</option>
                <option value="5">5th Semester</option>
                <option value="6">6th Semester</option>
                <option value="7">7th Semester</option>
                <option value="8">8th Semester</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="credits">Credits *</label>
              <select
                id="credits"
                name="credits"
                value={formData.credits}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Credits</option>
                <option value="1">1 Credit</option>
                <option value="2">2 Credits</option>
                <option value="3">3 Credits</option>
                <option value="4">4 Credits</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="professor">Professor *</label>
              <select
                id="professor"
                name="professor"
                value={formData.professor}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Professor</option>
                {professors.map(prof => (
                  <option key={prof._id} value={prof._id}>
                    {prof.name} ({prof.department})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="academicYear">Academic Year *</label>
            <input
              type="text"
              id="academicYear"
              name="academicYear"
              value={formData.academicYear}
              onChange={handleInputChange}
              required
              placeholder="e.g., 2024-2025"
            />
          </div>

          {message && (
            <div className={message.includes('successfully') ? styles.success : styles.error}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Adding Subject...' : 'Add Subject'}
          </button>
        </form>
      </div>
    </div>
  );
}
