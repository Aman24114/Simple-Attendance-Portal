'use client';
import { useState } from 'react';
import styles from './add-professor.module.css';

export default function AddProfessorPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    department: '',
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
          role: 'professor'
        }),
      });

      if (response.ok) {
        setMessage('Professor added successfully!');
        setFormData({
          name: '',
          email: '',
          password: '',
          department: '',
          phoneNumber: ''
        });
      } else {
        const error = await response.json();
        setMessage(error.message || 'Failed to add professor');
      }
    } catch (error) {
      setMessage('Failed to add professor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Add New Professor</h1>
        <p>Register a new professor in the system</p>
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
            {loading ? 'Adding Professor...' : 'Add Professor'}
          </button>
        </form>
      </div>
    </div>
  );
}
