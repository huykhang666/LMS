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
    { path: '/admin', label: 'Tổng quan doanh thu', icon: LayoutDashboard },
    { path: '/admin/users', label: 'Quản lý học viên', icon: Users },
  ];

  return (
    <div className="flex h-screen bg-paper overflow-hidden">
      {/* Sidebar - Notebook Binder style */}
      <aside className="w-64 border-r border-border bg-paper-raised flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo / Header */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2 text-ink">
              <GraduationCap className="h-6 w-6 text-accent" strokeWidth={2.5} />
              <span className="font-display text-lg font-bold">LMS Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-accent text-white shadow-sm font-semibold'
                      : 'text-ink-soft hover:bg-paper-dim hover:text-accent'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-border space-y-1">
          {user && (
            <div className="px-4 py-2 text-xs text-muted mb-2">
              Đăng nhập làm: <span className="font-semibold text-ink break-all">{user.displayName || user.email}</span>
            </div>
          )}
          
          <Link
            to="/app/dashboard"
            className="flex items-center gap-3 px-4 py-2.5 rounded-md text-xs font-medium text-ink-soft hover:bg-paper-dim transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Về ứng dụng chính
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 rounded-md text-xs font-medium text-danger hover:bg-paper-dim transition-colors"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="h-16 border-b border-border bg-paper-raised flex items-center justify-between px-8 shadow-xs shrink-0">
          <h2 className="text-lg font-semibold text-ink font-display">Khu vực quản trị hệ thống</h2>
          <div className="flex items-center gap-3">
            <img
              src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'}
              alt="Admin avatar"
              className="h-8 w-8 rounded-full border border-border"
            />
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
