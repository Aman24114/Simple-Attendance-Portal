'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '../login.module.css';

export default function AdminLogin() {
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
        body: JSON.stringify({ ...form, role: 'admin' })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');

      if (data?.user?.role === 'admin') {
        router.push('/dashboard');
      } else {
        setMsg('This account is not registered as an administrator');
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
          <h1>Admin Login</h1>
          <p>Sign in to manage the attendance portal</p>
        </div>

        {msg && <div className={styles.error}>{msg}</div>}

        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address *</label>
            <input
              type="email"
              id="email"
              placeholder="Enter your admin email"
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
            {loading ? 'Signing in…' : 'Sign In as Admin'}
          </button>
        </form>

        <div className={styles.switchAuth}>
          <p>Not an admin? <Link href="/login/student">Student Login</Link> | <Link href="/login/professor">Professor Login</Link></p>
          <p>New here? <Link href="/signup">Create an account</Link></p>
        </div>
      </div>
    </div>
  );
}
