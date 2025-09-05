'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchMe = async () => {
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (!res.ok) return;
        const data = await res.json();
        if (data?.user) {
          setIsLoggedIn(true);
          setUserRole(data.user.role);
        } else {
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } catch (e) {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };
    fetchMe();
  }, []);

  if (isLoggedIn) {
    return (
      <main className={styles.main}>
        <div className={styles.header}>
          <h1 className={styles.title}>NIT Jamshedpur</h1>
          <h2 className={styles.subtitle}>Attendance Portal</h2>
        </div>
        
        <div className={styles.dashboard}>
          {userRole === 'student' && (
            <div className={styles.roleSection}>
              <h3>Student Dashboard</h3>
              <div className={styles.cardGrid}>
                <Link href="/dashboard/attendance" className={styles.card}>
                  <h4>View Attendance</h4>
                  <p>Check your attendance records</p>
                </Link>
                <Link href="/dashboard/schedule" className={styles.card}>
                  <h4>Class Schedule</h4>
                  <p>View your class timings</p>
                </Link>
                <Link href="/dashboard/subjects" className={styles.card}>
                  <h4>My Subjects</h4>
                  <p>View enrolled subjects</p>
                </Link>
                <Link href="/dashboard/profile" className={styles.card}>
                  <h4>Profile</h4>
                  <p>Update your information</p>
                </Link>
              </div>
            </div>
          )}

          {userRole === 'professor' && (
            <div className={styles.roleSection}>
              <h3>Professor Dashboard</h3>
              <div className={styles.cardGrid}>
                <Link href="/dashboard/mark-attendance" className={styles.card}>
                  <h4>Mark Attendance</h4>
                  <p>Mark student attendance</p>
                </Link>
                <Link href="/dashboard/attendance-reports" className={styles.card}>
                  <h4>Attendance Reports</h4>
                  <p>Generate attendance reports</p>
                </Link>
                <Link href="/dashboard/my-subjects" className={styles.card}>
                  <h4>My Subjects</h4>
                  <p>Manage your subjects</p>
                </Link>
                <Link href="/dashboard/profile" className={styles.card}>
                  <h4>Profile</h4>
                  <p>Update your information</p>
                </Link>
              </div>
            </div>
          )}

          {userRole === 'admin' && (
            <div className={styles.roleSection}>
              <h3>Admin Dashboard</h3>
              <div className={styles.cardGrid}>
                <Link href="/dashboard/users" className={styles.card}>
                  <h4>Manage Users</h4>
                  <p>Add/edit users and roles</p>
                </Link>
                <Link href="/dashboard/subjects" className={styles.card}>
                  <h4>Manage Subjects</h4>
                  <p>Add/edit subjects</p>
                </Link>
                <Link href="/dashboard/enrollments" className={styles.card}>
                  <h4>Enrollments</h4>
                  <p>Manage student enrollments</p>
                </Link>
                <Link href="/dashboard/reports" className={styles.card}>
                  <h4>System Reports</h4>
                  <p>Generate system reports</p>
                </Link>
              </div>
            </div>
          )}

          <div className={styles.actions}>
            <button 
              onClick={async () => {
                try {
                  await fetch('/api/auth/logout', { method: 'POST' });
                } catch {}
                setIsLoggedIn(false);
                setUserRole(null);
                window.location.reload();
              }}
              className={styles.logoutBtn}
            >
              Logout
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>NIT Jamshedpur</h1>
        <h2 className={styles.subtitle}>Attendance Portal</h2>
        <p className={styles.description}>
          Welcome to the official attendance management system of National Institute of Technology, Jamshedpur.
          Track attendance, manage classes, and generate reports efficiently.
        </p>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>📚 Students</h3>
          <p>View your attendance records</p>
        </div>
        <div className={styles.feature}>
          <h3>👨‍🏫 Professors</h3>
          <p>Mark attendance for your classes</p>
        </div>
        <div className={styles.feature}>
          <h3>⚙️ Administrators</h3>
          <p>Add students, professors, and subjects</p>
        </div>
      </div>

      <div className={styles.authSection}>
        <h3>Get Started</h3>
        <div className={styles.authButtons}>
          <Link href="/signup" className={styles.signupBtn}>
            Create Account
          </Link>
          <Link href="/login" className={styles.loginBtn}>
            Sign In
          </Link>
        </div>
      </div>

      <div className={styles.footer}>
        <p>&copy; 2024 NIT Jamshedpur. All rights reserved.</p>
        <p>National Institute of Technology, Jamshedpur, Jharkhand, India</p>
      </div>
    </main>
  );
}
