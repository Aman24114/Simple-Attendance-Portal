'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './mark-attendance.module.css';

export default function MarkAttendancePage() {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState('morning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchSubjects = useCallback(async () => {
    try {
      const response = await fetch('/api/dashboard/professor-subjects');
      if (response.ok) {
        const data = await response.json();
        setSubjects(data.subjects || []);
      }
    } catch (error) {
      console.error('Error fetching subjects:', error);
    }
  }, []);

  const fetchStudents = useCallback(async () => {
    try {
      const response = await fetch(`/api/dashboard/subject-students?subjectId=${selectedSubject}`);
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        const initialAttendance = {};
        data.students.forEach(student => {
          initialAttendance[student._id] = 'present';
        });
        setAttendance(initialAttendance);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchSubjects();
  }, [fetchSubjects]);

  useEffect(() => {
    if (selectedSubject) {
      fetchStudents();
    }
  }, [selectedSubject, fetchStudents]);

  const handleAttendanceChange = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const submitAttendance = async () => {
    if (!selectedSubject || Object.keys(attendance).length === 0) {
      alert('Please select a subject and mark attendance');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/dashboard/mark-attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subjectId: selectedSubject,
          date: date,
          session: session,
          attendance: attendance
        }),
      });

      if (response.ok) {
        alert('Attendance marked successfully!');
        // Reset form
        setAttendance({});
        setSelectedSubject('');
        setStudents([]);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to mark attendance');
      }
    } catch (error) {
      console.error('Error marking attendance:', error);
      alert('Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#6b7280';
      default: return '#e2e8f0';
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Mark Attendance</h1>
        <p>Take attendance for your classes</p>
      </div>

      <div className={styles.formSection}>
        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label htmlFor="subject">Select Subject *</label>
            <select
              id="subject"
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className={styles.select}
            >
              <option value="">Choose a subject</option>
              {subjects.map(subject => (
                <option key={subject._id} value={subject._id}>
                  {subject.subjectCode} - {subject.subjectName}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="date">Date *</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.input}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="session">Session *</label>
            <select
              id="session"
              value={session}
              onChange={(e) => setSession(e.target.value)}
              className={styles.select}
            >
              <option value="morning">Morning</option>
              <option value="afternoon">Afternoon</option>
              <option value="evening">Evening</option>
            </select>
          </div>
        </div>
      </div>

      {students.length > 0 && (
        <div className={styles.attendanceSection}>
          <div className={styles.sectionHeader}>
            <h2>Student Attendance</h2>
            <p>{students.length} students enrolled</p>
          </div>

          <div className={styles.studentsList}>
            {students.map(student => (
              <div key={student._id} className={styles.studentCard}>
                <div className={styles.studentInfo}>
                  <div className={styles.studentAvatar}>
                    {student.name.charAt(0).toUpperCase()}
                  </div>
                  <div className={styles.studentDetails}>
                    <h3>{student.name}</h3>
                    <p>{student.rollNumber} • {student.department}</p>
                  </div>
                </div>

                <div className={styles.attendanceOptions}>
                  {['present', 'absent', 'late', 'excused'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleAttendanceChange(student._id, status)}
                      className={`${styles.statusBtn} ${
                        attendance[student._id] === status ? styles.active : ''
                      }`}
                      style={{
                        backgroundColor: attendance[student._id] === status 
                          ? getStatusColor(status) 
                          : '#f8f9fa',
                        color: attendance[student._id] === status ? 'white' : '#374151'
                      }}
                    >
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={styles.submitSection}>
            <button
              onClick={submitAttendance}
              disabled={loading}
              className={styles.submitBtn}
            >
              {loading ? 'Marking Attendance...' : 'Mark Attendance'}
            </button>
          </div>
        </div>
      )}

      {!selectedSubject && (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>📚</div>
          <h3>Select a Subject</h3>
          <p>Choose a subject from the dropdown above to start marking attendance</p>
        </div>
      )}
    </div>
  );
}
