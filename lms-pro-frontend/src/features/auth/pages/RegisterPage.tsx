import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthActions } from '../hooks/useAuth';
import { UserPlus, AlertCircle, Sparkles, BookOpen, Clock, ShieldCheck } from 'lucide-react';

export function RegisterPage() {
  const { registerWithEmail } = useAuthActions();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ tất cả các trường.');
      return;
    }

    if (password.length < 6) {
      setError('Mật khẩu phải chứa ít nhất 6 ký tự.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Xác nhận mật khẩu không trùng khớp.');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      await registerWithEmail(email, password, name);
      navigate('/app/dashboard');
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        setError('Địa chỉ email này đã được sử dụng bởi tài khoản khác.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Định dạng email không hợp lệ.');
      } else {
        setError('Đăng ký thất bại. Vui lòng kiểm tra lại thông tin.');
      }
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
          bottom: -100, left: -100, filter: 'blur(30px)', pointerEvents: 'none',
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
            background: 'rgba(62,124,89,0.15)',
            border: '1px solid rgba(62,124,89,0.4)',
            borderRadius: 99, padding: '4px 12px', marginBottom: '1.5rem',
          }}>
            <Sparkles size={11} style={{ color: 'var(--color-success)' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--color-success)', fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Kiến tạo tương lai
            </span>
          </div>

          <h2 style={{
            fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 700, color: '#fff',
            lineHeight: 1.15, marginBottom: '1.25rem',
          }}>
            Khởi đầu hành trình{' '}
            <span style={{ color: 'var(--color-accent)', fontStyle: 'italic' }}>
              học tập mới.
            </span>
          </h2>
          
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6, marginBottom: '2rem' }}>
            Trở thành học viên của hệ thống LMS Pro. Nhận quyền truy cập trọn đời vào kho tài nguyên học tập và bài thực hành chất lượng cao.
          </p>

          {/* Feature highlights list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              { icon: BookOpen, text: 'Truy cập thư viện bài học đa dạng', color: 'var(--color-accent)' },
              { icon: Clock, text: 'Học mọi lúc mọi nơi theo tiến độ riêng', color: '#F59E0B' },
              { icon: ShieldCheck, text: 'Tài khoản bảo mật tuyệt đối', color: 'var(--color-success)' }
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

      {/* RIGHT PANEL: Register Form */}
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
          width: '100%', maxWidth: 420,
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

          <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-ink)', marginBottom: 6 }}>
              Đăng ký học viên
            </h1>
            <p style={{ fontSize: 13, color: 'var(--color-ink-soft)' }}>
              Bắt đầu hành trình chinh phục kiến thức mới
            </p>
          </div>

          {error && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              backgroundColor: 'rgba(179,64,44,0.08)',
              border: '1px solid rgba(179,64,44,0.2)',
              borderRadius: 8, padding: '10px 14px',
              fontSize: 12, color: 'var(--color-danger)',
              marginBottom: '1.25rem',
            }}>
              <AlertCircle size={15} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div>
              <label htmlFor="name" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 5 }}>
                Họ và tên
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={{
                  width: '100%', borderRadius: 8, border: '1px solid var(--color-border)',
                  backgroundColor: 'var(--color-paper-dim)',
                  fontSize: 13, color: 'var(--color-ink)', outline: 'none',
                  transition: 'border-color 0.2s',
                  padding: '10px 12px'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                placeholder="Nguyễn Văn A"
                required
              />
            </div>

            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 5 }}>
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
              <label htmlFor="password" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 5 }}>
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
                placeholder="Tối thiểu 6 ký tự"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" style={{ display: 'block', fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-ink-soft)', marginBottom: 5 }}>
                Xác nhận mật khẩu
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
              <UserPlus size={15} />
              {loading ? 'Đang khởi tạo tài khoản...' : 'Đăng ký học viên'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: 12, color: 'var(--color-ink-soft)', borderTop: '1px solid var(--color-border)', paddingTop: '1.25rem' }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{ fontWeight: 700, color: 'var(--color-accent)', textDecoration: 'none' }}>
              Đăng nhập ngay
            </Link>
          </div>
        </div>
      </div>

    </div>
  );
}

