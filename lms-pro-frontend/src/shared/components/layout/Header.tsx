import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuthActions } from '@/features/auth/hooks/useAuth';
import {
  BookOpen, Menu, X, ChevronDown, LogOut, LayoutDashboard,
  FileText, Sparkles
} from 'lucide-react';

export function Header() {
  const { user } = useAuthStore();
  const { logout } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Detect scroll for header style change
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const isOnDarkHero = location.pathname === '/';
  const isTransparent = isOnDarkHero && !scrolled;

  return (
    <header
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        zIndex: 100,
        height: 60,
        display: 'flex',
        alignItems: 'center',
        transition: 'all 0.3s ease',
        background: isTransparent
          ? 'transparent'
          : scrolled
          ? 'rgba(27,42,74,0.95)'
          : 'var(--color-paper-raised)',
        borderBottom: isTransparent
          ? '1px solid transparent'
          : `1px solid ${scrolled ? 'rgba(255,255,255,0.1)' : 'var(--color-border)'}`,
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.12)' : 'none',
      }}
    >
      <div
        className="mx-auto flex w-full items-center justify-between px-4 sm:px-6"
        style={{ maxWidth: 1280 }}
      >
        {/* ── Logo ── */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          style={{ textDecoration: 'none' }}
        >
          <div style={{
            width: 32, height: 32,
            borderRadius: 8,
            background: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(224,115,74,0.4)',
          }}>
            <BookOpen size={17} style={{ color: '#fff' }} />
          </div>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.05rem',
            color: isTransparent ? '#fff' : 'var(--color-ink)',
            letterSpacing: '-0.01em',
          }}>
            LMS Pro
          </span>
        </Link>

        {/* ── Nav links (desktop) ── */}
        <nav className="hidden md:flex items-center gap-6">
          {[
            { label: 'Khám phá khóa học', to: '/courses' },
            ...(user ? [
              { label: 'Dashboard', to: '/app/dashboard' },
              { label: 'Ghi chú', to: '/app/notes' },
            ] : []),
            ...(user?.role === 'admin' ? [
              { label: 'Admin', to: '/admin' },
            ] : []),
          ].map(link => (
            <Link
              key={link.to}
              to={link.to}
              style={{
                fontSize: 13,
                fontWeight: 600,
                color: isTransparent
                  ? 'rgba(255,255,255,0.8)'
                  : location.pathname === link.to
                  ? 'var(--color-accent)'
                  : 'var(--color-ink-soft)',
                textDecoration: 'none',
                transition: 'color 0.15s',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLElement).style.color = isTransparent ? '#fff' : 'var(--color-accent)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLElement).style.color = isTransparent
                  ? 'rgba(255,255,255,0.8)'
                  : location.pathname === link.to
                  ? 'var(--color-accent)'
                  : 'var(--color-ink-soft)';
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* ── Auth area ── */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            /* User avatar + dropdown */
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setUserMenuOpen(o => !o)}
                className="flex items-center gap-2"
                style={{
                  background: isTransparent ? 'rgba(255,255,255,0.12)' : 'var(--color-paper-dim)',
                  border: isTransparent ? '1px solid rgba(255,255,255,0.2)' : '1px solid var(--color-border)',
                  borderRadius: 99,
                  padding: '5px 10px 5px 6px',
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'var(--color-accent)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 700, fontSize: 12,
                  fontFamily: 'var(--font-mono)',
                  overflow: 'hidden',
                }}>
                  {user.avatarUrl
                    ? <img src={user.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : (user.displayName?.[0] ?? user.email?.[0] ?? '?').toUpperCase()
                  }
                </div>
                <span style={{
                  fontSize: 13,
                  fontWeight: 600,
                  maxWidth: 100,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  color: isTransparent ? '#fff' : 'var(--color-ink)',
                }}>
                  {(() => {
                    const parts = user.displayName?.split(' ') || [];
                    return parts[parts.length - 1] || 'Học viên';
                  })()}
                </span>
                <ChevronDown
                  size={14}
                  style={{
                    color: isTransparent ? 'rgba(255,255,255,0.6)' : 'var(--color-muted)',
                    transition: 'transform 0.2s',
                    transform: userMenuOpen ? 'rotate(180deg)' : 'none',
                  }}
                />
              </button>

              {/* Dropdown */}
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', top: 'calc(100% + 8px)', right: 0,
                  minWidth: 200,
                  background: 'var(--color-paper-raised)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 8px 32px rgba(27,42,74,0.12)',
                  overflow: 'hidden',
                  animation: 'fade-up 0.15s ease-out',
                  zIndex: 200,
                }}>
                  {/* User info */}
                  <div style={{
                    padding: '12px 16px',
                    borderBottom: '1px solid var(--color-border)',
                    background: 'var(--color-paper-dim)',
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color-ink)' }}>
                      {user.displayName}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-muted)', marginTop: 2 }}>
                      {user.email}
                    </div>
                  </div>

                  {/* Links */}
                  {[
                    { label: 'Dashboard', icon: LayoutDashboard, to: '/app/dashboard' },
                    { label: 'Ghi chú của tôi', icon: FileText, to: '/app/notes' },
                    ...(user.role === 'admin' ? [{ label: 'Quản trị', icon: Sparkles, to: '/admin' }] : []),
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.to}
                        to={item.to}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 16px',
                          fontSize: 13,
                          color: 'var(--color-ink-soft)',
                          textDecoration: 'none',
                          transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'var(--color-paper-dim)';
                          el.style.color = 'var(--color-accent)';
                        }}
                        onMouseLeave={e => {
                          const el = e.currentTarget as HTMLElement;
                          el.style.background = 'transparent';
                          el.style.color = 'var(--color-ink-soft)';
                        }}
                      >
                        <Icon size={14} /> {item.label}
                      </Link>
                    );
                  })}

                  {/* Logout */}
                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      width: '100%',
                      padding: '10px 16px',
                      fontSize: 13,
                      color: 'var(--color-danger)',
                      borderTop: '1px solid var(--color-border)',
                      background: 'transparent',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--color-paper-dim)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    <LogOut size={14} /> Đăng xuất
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest actions */
            <>
              <Link
                to="/login"
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: isTransparent ? 'rgba(255,255,255,0.85)' : 'var(--color-ink-soft)',
                  textDecoration: 'none',
                  transition: 'color 0.15s',
                }}
              >
                Đăng nhập
              </Link>
              <Link
                to="/register"
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: '#fff',
                  background: 'var(--color-accent)',
                  padding: '7px 18px',
                  borderRadius: 8,
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                  boxShadow: '0 2px 8px rgba(224,115,74,0.3)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-accent-deep)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.background = 'var(--color-accent)';
                }}
              >
                Đăng ký
              </Link>
            </>
          )}
        </div>

        {/* ── Mobile hamburger ── */}
        <button
          id="mobile-menu-toggle"
          className="md:hidden"
          onClick={() => setMobileOpen(o => !o)}
          aria-label="Toggle menu"
          style={{
            color: isTransparent ? '#fff' : 'var(--color-ink)',
            padding: 6,
            borderRadius: 8,
            background: 'transparent',
          }}
        >
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* ── Mobile menu ── */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: 60, left: 0, right: 0,
            background: 'var(--color-paper-raised)',
            borderBottom: '1px solid var(--color-border)',
            boxShadow: '0 8px 24px rgba(27,42,74,0.1)',
            padding: '1rem',
            animation: 'fade-up 0.15s ease-out',
            zIndex: 99,
          }}
        >
          <div className="flex flex-col gap-1">
            {[
              { label: 'Khám phá khóa học', to: '/courses' },
              ...(user ? [
                { label: 'Dashboard', to: '/app/dashboard' },
                { label: 'Ghi chú của tôi', to: '/app/notes' },
              ] : [
                { label: 'Đăng nhập', to: '/login' },
                { label: 'Đăng ký', to: '/register' },
              ]),
            ].map(link => (
              <Link
                key={link.to}
                to={link.to}
                style={{
                  display: 'block',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-ink-soft)',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'var(--color-paper-dim)';
                  el.style.color = 'var(--color-accent)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.background = 'transparent';
                  el.style.color = 'var(--color-ink-soft)';
                }}
              >
                {link.label}
              </Link>
            ))}
            {user && (
              <button
                onClick={handleLogout}
                style={{
                  display: 'block',
                  width: '100%',
                  textAlign: 'left',
                  padding: '10px 12px',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  color: 'var(--color-danger)',
                  background: 'transparent',
                  marginTop: 4,
                  borderTop: '1px solid var(--color-border)',
                  paddingTop: 14,
                  cursor: 'pointer',
                }}
              >
                Đăng xuất
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
