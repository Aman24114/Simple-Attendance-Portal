'use client';
import { useState } from 'react';
import styles from './add-student.module.css';

export default function AddStudentPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    rollNumber: '',
    department: '',
    batch: '',
    currentSemester: '',
    section: '',
    phoneNumber: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

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
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          role: 'student'
        }),
      });

      if (response.ok) {
        setMessage('Student added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          rollNumber: '',
          department: '',
          batch: '',
          currentSemester: '',
          section: '',
          phoneNumber: ''
        });
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add student');
      }
    } catch (error) {
      setMessage('Failed to add student');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add New Student</h1>
        <p>Register a new student in the system</p>
      </div>

      <div className={styles.formContainer}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Full Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="Enter email address"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password *</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
                minLength={6}
                placeholder="Enter password (min 6 characters)"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="rollNumber">Roll Number *</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleInputChange}
                required
                placeholder="e.g., 2020CS001"
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
              <label htmlFor="batch">Batch *</label>
              <select
                id="batch"
                name="batch"
                value={formData.batch}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Batch</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="currentSemester">Current Semester *</label>
              <select
                id="currentSemester"
                name="currentSemester"
                value={formData.currentSemester}
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

            <div className={styles.formGroup}>
              <label htmlFor="section">Section *</label>
              <select
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                required
              >
                <option value="">Select Section</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              placeholder="Enter phone number"
            />
          </div>

          {message && (
            <div className={message.includes('successfully') ? styles.success : styles.error}>
              {message}
            </div>
          )}

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            {loading ? 'Adding Student...' : 'Add Student'}
          </button>
        </form>
      </div>
    </div>
  );
}
