'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login.module.css';

export default function StudentLogin() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'student' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data?.user?.role === 'student') {
        router.push('/dashboard');
      } else {
        setMsg('This account is not registered as a student');
      }
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <div className={styles.header}>
          <h1>Student Login</h1>
          <p>Sign in to access your academic dashboard</p>
        </div>

        {msg && <div className={styles.error}>{msg}</div>}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your student email"
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={e => setForm({ ...form, password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button disabled={loading} type="submit" className={styles.submitBtn}>
            {loading ? 'Signing in…' : 'Sign In as Student'}
          </button>
        </form>

        <div className={styles.switchAuth}>
          <p>Not a student? <Link href="/login/professor">Professor Login</Link> | <Link href="/login/admin">Admin Login</Link></p>
          <p>New here? <Link href="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
