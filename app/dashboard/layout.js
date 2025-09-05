'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import styles from './dashboard.module.css';

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me', { cache: 'no-store' });
        if (response.ok) {
          const data = await response.json();
          if (data?.user) {
            setUser(data.user);
          } else {
            router.push('/login');
          }
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try { await fetch('/api/auth/logout', { method: 'POST' }); } catch {}
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getNavItems = () => {
    if (user.role === 'student') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/dashboard/attendance', label: 'My Attendance', icon: '📊' }
      ];
    } else if (user.role === 'professor') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/dashboard/mark-attendance', label: 'Mark Attendance', icon: '✏️' }
      ];
    } else if (user.role === 'admin') {
      return [
        { href: '/dashboard', label: 'Dashboard', icon: '🏠' },
        { href: '/dashboard/add-student', label: 'Add Student', icon: '👥' },
        { href: '/dashboard/add-professor', label: 'Add Professor', icon: '👨‍🏫' },
        { href: '/dashboard/add-subject', label: 'Add Subject', icon: '📚' }
      ];
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2>NIT Jamshedpur</h2>
          <p>Attendance Portal</p>
        </div>
        
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navItem} ${pathname === item.href ? styles.active : ''}`}
            >
              <span className={styles.navIcon}>{item.icon}</span>
              <span className={styles.navLabel}>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className={styles.userInfo}>
          <div className={styles.userAvatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.userDetails}>
            <p className={styles.userName}>{user.name}</p>
            <p className={styles.userRole}>{user.role}</p>
          </div>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            🚪
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.breadcrumb}>
            {pathname.split('/').slice(2).map((segment, index) => (
              <span key={index}>
                {index > 0 && <span className={styles.separator}>/</span>}
                <span className={styles.segment}>
                  {segment === 'dashboard' ? 'Home' : segment.split('-').map(word => 
                    word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </span>
              </span>
            ))}
          </div>
          <div className={styles.headerActions}>
            <span className={styles.welcome}>Welcome, {user.name}!</span>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
