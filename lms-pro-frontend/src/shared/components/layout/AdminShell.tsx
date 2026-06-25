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
      {/* Sidebar - Minimal flat layout */}
      <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between shrink-0">
        <div>
          {/* Logo / Header */}
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <Link to="/admin" className="flex items-center gap-2 text-slate-900">
              <GraduationCap className="h-5 w-5 text-accent" strokeWidth={2.5} />
              <span className="font-display text-sm font-semibold tracking-tight">LMS Pro Admin</span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="p-3 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                    isActive
                      ? 'bg-[#EEF2FF] text-accent font-semibold'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${isActive ? 'text-accent' : 'text-slate-400'}`} strokeWidth={isActive ? 2.5 : 2} />
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-200 bg-white space-y-2">
          {user && (
            <div className="px-3 py-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 mb-2">
              <span className="text-slate-400 block mb-0.5 text-[10px] uppercase font-bold tracking-wider">Tài khoản:</span>
              <span className="font-semibold text-slate-800 break-all">{user.displayName || user.email}</span>
            </div>
          )}
          
          <Link
            to="/app/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-slate-650 hover:bg-slate-50 border border-slate-200 transition-all text-slate-700 shadow-xs"
          >
            <ArrowLeft className="h-3.5 w-3.5 text-slate-400" />
            Về ứng dụng chính
          </Link>

          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-danger hover:bg-red-50/50 border border-red-200/40 transition-all shadow-xs"
          >
            <LogOut className="h-3.5 w-3.5" />
            Đăng xuất quản trị
          </button>
        </div>
      </aside>

      {/* Main content wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header bar */}
        <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6 shrink-0">
          <h2 className="text-base font-semibold text-slate-900 font-display">Khu vực quản trị hệ thống</h2>
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={user?.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'}
                alt="Admin avatar"
                className="h-8 w-8 rounded-full border border-slate-200 bg-slate-50"
              />
              <span className="absolute bottom-0 right-0 block h-2 w-2 rounded-full bg-success ring-2 ring-white" />
            </div>
          </div>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 overflow-y-auto bg-paper p-6 sm:p-8">
          <div className="w-full max-w-7xl mx-auto animate-in fade-in duration-200">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
