'use client';

import Link from 'next/link';
import styles from './login.module.css';

export default function LoginPage() {
  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Welcome to NIT Jamshedpur</h1>
          <p>Choose your login portal</p>
        </div>

        <div className={styles.roleSelection}>
          <Link href="/login/student" className={styles.roleCard}>
            <div className={styles.roleIcon}>🎓</div>
            <h3>Student Portal</h3>
            <p>Access your attendance records, class schedule, and academic information</p>
          </Link>

          <Link href="/login/professor" className={styles.roleCard}>
            <div className={styles.roleIcon}>👨‍🏫</div>
            <h3>Professor Portal</h3>
            <p>Mark attendance, manage classes, and generate reports</p>
          </Link>

          <Link href="/login/admin" className={styles.roleCard}>
            <div className={styles.roleIcon}>⚙️</div>
            <h3>Admin Portal</h3>
            <p>Manage users, subjects, and system administration</p>
          </Link>
        </div>

        <div className={styles.switchAuth}>
          New here? <Link href="/signup">Create an account</Link>
        </div>
      </div>
    </div>
  );
}
