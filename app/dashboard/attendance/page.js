'use client';
import { useState, useEffect, useCallback } from 'react';
import styles from './attendance.module.css';

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [stats, setStats] = useState({});

  const fetchAttendance = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/dashboard/attendance?subject=${selectedSubject}`);
      if (response.ok) {
        const data = await response.json();
        setAttendance(data.attendance || []);
        setStats(data.stats || {});
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedSubject]);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'present': return '#10b981';
      case 'absent': return '#ef4444';
      case 'late': return '#f59e0b';
      case 'excused': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present': return '✅';
      case 'absent': return '❌';
      case 'late': return '⏰';
      case 'excused': return '📝';
      default: return '❓';
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading attendance records...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>My Attendance</h1>
        <p>Track your attendance across all subjects</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Overall Attendance</h3>
            <p className={styles.statValue}>{stats.overallPercentage || '0%'}</p>
            <span className={styles.statChange}>{stats.totalClasses || 0} classes</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statContent}>
            <h3>Present</h3>
            <p className={styles.statValue}>{stats.present || 0}</p>
            <span className={styles.statChange}>Classes attended</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>❌</div>
          <div className={styles.statContent}>
            <h3>Absent</h3>
            <p className={styles.statValue}>{stats.absent || 0}</p>
            <span className={styles.statChange}>Classes missed</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <h3>Late</h3>
            <p className={styles.statValue}>{stats.late || 0}</p>
            <span className={styles.statChange}>Late arrivals</span>
          </div>
        </div>
      </div>

      <div className={styles.filters}>
        <select 
          value={selectedSubject} 
          onChange={(e) => setSelectedSubject(e.target.value)}
          className={styles.subjectFilter}
        >
          <option value="all">All Subjects</option>
          <option value="CS101">Data Structures</option>
          <option value="CS102">Algorithms</option>
          <option value="CS103">Database Systems</option>
        </select>
      </div>

      <div className={styles.attendanceTable}>
        <div className={styles.tableHeader}>
          <div className={styles.headerCell}>Date</div>
          <div className={styles.headerCell}>Subject</div>
          <div className={styles.headerCell}>Status</div>
          <div className={styles.headerCell}>Session</div>
          <div className={styles.headerCell}>Remarks</div>
        </div>

        {attendance.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No attendance records found</p>
          </div>
        ) : (
          attendance.map((record, index) => (
            <div key={index} className={styles.tableRow}>
              <div className={styles.tableCell}>
                {new Date(record.date).toLocaleDateString()}
              </div>
              <div className={styles.tableCell}>{record.subject}</div>
              <div className={styles.tableCell}>
                <span 
                  className={styles.statusBadge}
                  style={{ backgroundColor: getStatusColor(record.status) }}
                >
                  {getStatusIcon(record.status)} {record.status}
                </span>
              </div>
              <div className={styles.tableCell}>{record.session}</div>
              <div className={styles.tableCell}>{record.remarks || '-'}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
