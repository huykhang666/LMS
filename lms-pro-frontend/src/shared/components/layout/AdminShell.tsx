import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useAuthActions } from '@/features/auth/hooks/useAuth';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  BarChart3, 
  ArrowLeft, 
  LogOut, 
  GraduationCap 
} from 'lucide-react';

export function AdminShell() {
  const { user } = useAuthStore();
  const { logout } = useAuthActions();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
    { path: '/admin/courses', label: 'Quản lý khóa học', icon: BookOpen },
    { path: '/admin/users', label: 'Quản lý học viên', icon: Users },
    { path: '/admin/analytics', label: 'Báo cáo thống kê', icon: BarChart3 },
  ];

  return (
    <div className="flex h-screen bg-paper overflow-hidden font-sans">
      {/* Sidebar - Modern Premium layout */}
      <aside className="w-72 border-r border-border bg-paper-raised flex flex-col justify-between shrink-0 shadow-md z-10">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-border flex items-center justify-between bg-white">
            <Link to="/admin" className="flex items-center gap-2.5 text-ink">
              <div className="p-2 rounded-xl bg-accent/10 border border-accent/20">
                <GraduationCap className="h-6 w-6 text-accent" strokeWidth={2.5} />
              </div>
              <span className="font-display text-xl font-extrabold tracking-tight bg-gradient-to-r from-accent to-indigo-600 bg-clip-text text-transparent">LMS Pro Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-5 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl text-sm transition-all duration-200 hover:scale-[1.01] ${
                    isActive
                      ? 'bg-gradient-to-r from-accent to-indigo-600 text-white shadow-md shadow-accent/25 font-bold'
                      : 'text-ink-soft hover:bg-paper-dim hover:text-accent font-semibold'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-muted'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-5 border-t border-border bg-slate-50/50 space-y-2">
          {user && (
            <div className="px-4 py-3 rounded-xl bg-white border border-border text-xs text-ink-soft mb-2 shadow-xs">
              <span className="text-muted block mb-0.5">Tài khoản quản trị:</span>
              <span className="font-extrabold text-ink break-all text-sm">{user.displayName || user.email}</span>
            </div>
          )}
          
          <Link
            to="/app/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-ink-soft hover:bg-paper-dim hover:text-accent border border-border bg-white transition-all shadow-xs"
          >
            <ArrowLeft className="h-4 w-4 text-muted" />
            Về ứng dụng chính
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold text-danger hover:bg-danger/10 border border-danger/20 bg-white transition-all shadow-xs"
          >
            <LogOut className="h-4 w-4" />
            Đăng xuất quản trị
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="h-20 border-b border-border bg-white flex items-center justify-between px-8 shadow-sm shrink-0">
          <h2 className="text-xl font-extrabold text-ink font-display tracking-tight">Khu vực quản trị hệ thống</h2>
          <div className="flex items-center gap-3">
            <div className="relative group">
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'}
                alt="Admin avatar"
                className="h-10 w-10 rounded-full border-2 border-accent/20 bg-slate-100 hover:border-accent transition-colors duration-200"
              />
              <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-success ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-paper p-8">
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
