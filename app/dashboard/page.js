'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './dashboard-home.module.css';

export default function DashboardHome() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserAndStats = async () => {
      try {
        // Fetch user data (cookie-based)
        const userResponse = await fetch('/api/auth/me', { cache: 'no-store' });
        if (userResponse.ok) {
          const me = await userResponse.json();
          if (!me?.user) return setUser(null);
          const userData = me.user;
          setUser(userData);
          
          // Fetch role-specific stats
          await fetchStats(userData.role);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndStats();
  }, []);

  const fetchStats = async (role) => {
    try {
      if (role === 'student') {
        const response = await fetch('/api/dashboard/student-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } else if (role === 'professor') {
        const response = await fetch('/api/dashboard/professor-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } else if (role === 'admin') {
        const response = await fetch('/api/dashboard/admin-stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) return null;

  const renderStudentDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.welcomeSection}>
        <h1>Welcome back, {user.name}! 👋</h1>
        <p>Here's your academic overview for this semester</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Overall Attendance</h3>
            <p className={styles.statValue}>{stats.overallAttendance || '85%'}</p>
            <span className={styles.statChange}>+2.5% from last month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3>Enrolled Subjects</h3>
            <p className={styles.statValue}>{stats.enrolledSubjects || '6'}</p>
            <span className={styles.statChange}>Current semester</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📅</div>
          <div className={styles.statContent}>
            <h3>Classes This Week</h3>
            <p className={styles.statValue}>{stats.classesThisWeek || '24'}</p>
            <span className={styles.statChange}>Next: Data Structures</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statContent}>
            <h3>Attendance Goal</h3>
            <p className={styles.statValue}>{stats.attendanceGoal || '75%'}</p>
            <span className={styles.statChange}>Target achieved!</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link href="/dashboard/attendance" className={styles.actionCard}>
            <div className={styles.actionIcon}>📊</div>
            <h3>View Attendance</h3>
            <p>Check your detailed attendance records</p>
          </Link>
        </div>
      </div>
    </div>
  );

  const renderProfessorDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.welcomeSection}>
        <h1>Welcome, Professor {user.name}! 👨‍🏫</h1>
        <p>Manage your classes and track student attendance</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Students</h3>
            <p className={styles.statValue}>{stats.totalStudents || '120'}</p>
            <span className={styles.statChange}>Across all subjects</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3>Active Subjects</h3>
            <p className={styles.statValue}>{stats.activeSubjects || '4'}</p>
            <span className={styles.statChange}>This semester</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>Avg. Attendance</h3>
            <p className={styles.statValue}>{stats.avgAttendance || '78%'}</p>
            <span className={styles.statChange}>Class average</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏰</div>
          <div className={styles.statContent}>
            <h3>Next Class</h3>
            <p className={styles.statValue}>{stats.nextClass || '2:00 PM'}</p>
            <span className={styles.statChange}>Data Structures Lab</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link href="/dashboard/mark-attendance" className={styles.actionCard}>
            <div className={styles.actionIcon}>✏️</div>
            <h3>Mark Attendance</h3>
            <p>Take attendance for your classes</p>
          </Link>
        </div>
      </div>
    </div>
  );

  const setupSampleSubjects = async () => {
    try {
      const response = await fetch('/api/dashboard/setup-subjects', {
        method: 'POST',
      });
      
      if (response.ok) {
        const data = await response.json();
        alert(data.message);
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to setup subjects');
      }
    } catch (error) {
      console.error('Error setting up subjects:', error);
      alert('Failed to setup subjects');
    }
  };

  const renderAdminDashboard = () => (
    <div className={styles.dashboardContent}>
      <div className={styles.welcomeSection}>
        <h1>Welcome, Administrator {user.name}! ⚙️</h1>
        <p>Manage the attendance portal and monitor system performance</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statContent}>
            <h3>Total Users</h3>
            <p className={styles.statValue}>{stats.totalUsers || '1,250'}</p>
            <span className={styles.statChange}>+15 this month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statContent}>
            <h3>Active Subjects</h3>
            <p className={styles.statValue}>{stats.activeSubjects || '45'}</p>
            <span className={styles.statChange}>This semester</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎓</div>
          <div className={styles.statContent}>
            <h3>Enrollments</h3>
            <p className={styles.statValue}>{stats.totalEnrollments || '3,200'}</p>
            <span className={styles.statChange}>+120 this month</span>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>📊</div>
          <div className={styles.statContent}>
            <h3>System Health</h3>
            <p className={styles.statValue}>{stats.systemHealth || '98%'}</p>
            <span className={styles.statChange}>All systems operational</span>
          </div>
        </div>
      </div>

      <div className={styles.quickActions}>
        <h2>Quick Actions</h2>
        <div className={styles.actionGrid}>
          <Link href="/dashboard/add-student" className={styles.actionCard}>
            <div className={styles.actionIcon}>👥</div>
            <h3>Add Student</h3>
            <p>Register new students in the system</p>
          </Link>
          <Link href="/dashboard/add-professor" className={styles.actionCard}>
            <div className={styles.actionIcon}>👨‍🏫</div>
            <h3>Add Professor</h3>
            <p>Register new professors in the system</p>
          </Link>
          <Link href="/dashboard/add-subject" className={styles.actionCard}>
            <div className={styles.actionIcon}>📚</div>
            <h3>Add Subject</h3>
            <p>Create new subjects in the system</p>
          </Link>
          <button 
            onClick={setupSampleSubjects}
            className={styles.actionCard}
            style={{ border: 'none', background: 'white', cursor: 'pointer' }}
          >
            <div className={styles.actionIcon}>⚡</div>
            <h3>Setup Sample Data</h3>
            <p>Create sample subjects for testing</p>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {user.role === 'student' && renderStudentDashboard()}
      {user.role === 'professor' && renderProfessorDashboard()}
      {user.role === 'admin' && renderAdminDashboard()}
    </div>
  );
}
