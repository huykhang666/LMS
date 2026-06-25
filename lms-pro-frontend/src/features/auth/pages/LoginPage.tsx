import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { LogIn, AlertCircle, Sparkles, BookOpen, Trophy, Flame } from 'lucide-react';

export function LoginPage() {
  const { loginWithEmail, loginWithGoogle } = useAuthActions();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/app/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ email và mật khẩu.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await loginWithEmail(email, password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else {
        setError('Đã xảy ra lỗi đăng nhập. Vui lòng thử lại.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setError(null);
      setLoading(true);
      await loginWithGoogle();
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error(err);
      setError('Đăng nhập bằng Google thất bại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--color-paper)', fontFamily: 'var(--font-body)' }}>
      
      {/* LEFT PANEL: Branding & Visuals (Hidden on small screens) */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #0d1a30 0%, #1B2A4A 60%, #243659 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '3rem',
        overflow: 'hidden',
      }} className="hidden lg:flex">
        {/* Grid pattern overlay */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '36px 36px',
        }} />
        
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(224,115,74,0.15) 0%, transparent 65%)',
          top: -100, left: -100, filter: 'blur(30px)', pointerEvents: 'none',
        }} />

        {/* Top brand */}
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            backgroundColor: 'var(--color-accent)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <BookOpen size={16} color="#fff" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: 20, fontWeight: 700, color: '#fff' }}>
            LMS Pro
          </span>
        </div>

        {/* Middle contents */}
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 440, margin: 'auto 0' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(224,115,74,0.15)',
            border: '1px solid rgba(224,115,74,0.4)',
            borderRadius: 99, padding: '4px 12px', marginBottom: '1.5rem',
          }}>
            <Sparkles size={11} style={{ color: 'var(--color-accent)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Chào mừng bạn quay lại
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#fff',
            lineHeight: 1.15, marginBottom: '1.25rem',
          }}>
            Khám phá tri thức,{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
              nâng tầm sự nghiệp.
            </span>
          </h2>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: '2rem' }}>
            Bắt đầu bài học mới ngay hôm nay. Hệ thống thông minh tự động ghi nhớ tiến trình và bài tập thực hành của bạn.
          </p>

          {/* Gamification stats list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: Flame, text: 'Duy trì Streak ngày học liên tiếp', color: 'var(--color-accent)' },
              { icon: Trophy, text: 'Tích lũy XP tăng cấp độ thành viên', color: '#F59E0B' },
              { icon: Sparkles, text: 'Bài kiểm tra cuối chương chất lượng', color: 'var(--color-success)' }
            ].map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 28, height: 28, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.06)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: item.color,
                }}>
                  <item.icon size={14} />
                </div>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.8)' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div style={{ position: 'relative', zIndex: 2, fontSize: 11, color: 'rgba(255,255,255,0.4)', fontFamily: 'var(--font-mono)' }}>
          © 2026 LMS Pro. Thiết kế theo phong cách Sổ tay Học tập.
        </div>
      </div>

      {/* RIGHT PANEL: Login Form */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
        position: 'relative',
      }}>
        {/* Background micro grid */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(var(--color-border) 1px, transparent 1px)',
          backgroundSize: '16px 16px', opacity: 0.25, pointerEvents: 'none',
        }} />

        <div style={{
          width: '100%', maxWidth: 400,
          background: 'var(--color-paper-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: 20,
          padding: '2.5rem',
          boxShadow: '0 8px 30px rgba(27,42,74,0.06)',
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-2 justify-center mb-6">
            <div style={{
              width: 28, height: 28, borderRadius: 6,
              backgroundColor: 'var(--color-accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <BookOpen size={14} color="#fff" />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700, color: 'var(--color-ink)' }}>
              LMS Pro
            </span>
          </div>

          <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
              Đăng nhập tài khoản
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
              Học tập bài bản, kiến tạo tương lai
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              backgroundColor: 'rgba(179,64,44,0.08)',
              border: '1px solid rgba(179,64,44,0.2)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 12, color: 'var(--color-danger)',
              marginBottom: '1.5rem',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 6 }}>
                Email của bạn
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  width: '100%', borderRadius: 8, border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-dim)',
                  fontSize: 13, color: 'var(--color-ink)', outline: 'none',
                  transition: 'border-color 0.2s',
                  padding: '10px 12px'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="ten@email.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 6 }}>
                Mật khẩu
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%', borderRadius: 8, border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-dim)',
                  fontSize: 13, color: 'var(--color-ink)', outline: 'none',
                  transition: 'border-color 0.2s',
                  padding: '10px 12px'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%', borderRadius: 8, backgroundColor: 'var(--color-accent)',
                color: '#fff', fontSize: 14, fontWeight: 700, border: 'none',
                padding: '12px', cursor: 'pointer', transition: 'all 0.2s',
                boxShadow: '0 4px 12px rgba(224,115,74,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                marginTop: 6
              }}
              onMouseEnter={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent-deep)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.backgroundColor = 'var(--color-accent)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <LogIn size={15} />
              {loading ? 'Đang xử lý...' : 'Đăng nhập'}
            </button>
          </form>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0', gap: 10 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
            <span style={{ fontSize: 11, color: 'var(--color-muted)', fontFamily: 'var(--font-mono)' }}>hoặc</span>
            <div style={{ flex: 1, height: 1, backgroundColor: 'var(--color-border)' }} />
          </div>

          {/* Google login button */}
          <button
            onClick={handleGoogleSignIn}
            disabled={loading}
            style={{
              width: '100%', borderRadius: 8, border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-raised)', color: 'var(--color-ink)',
              fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 8, padding: '10px 12px', cursor: 'pointer',
              transition: 'background-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-paper-dim)'}
            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-paper-raised)'}
          >
            <svg style={{ width: 16, height: 16 }} viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12 5.04c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 1.74 14.97.65 12 .65 7.7.65 3.99 3.12 2.18 6.71l3.66 2.84c.87-2.6 3.3-4.51 6.16-4.51z"
              />
              <path
                fill="#4285F4"
                d="M22.56 11.9c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31l3.57 2.77c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 13.74c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09L2.18 6.71C1.43 8.2 1 9.87 1 11.65s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#34A853"
                d="M12 22.65c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84c1.81 3.59 5.52 6.06 9.82 6.06z"
              />
            </svg>
            Đăng nhập bằng Google
          </button>

          <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: 12, color: 'var(--color-ink-soft)' }}>
            Chưa có tài khoản?{' '}
            <Link to="/register" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}>
              Đăng ký học viên mới
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

