import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import type { UserRole } from '@/types/user.types';

interface RequireRoleProps {
  role: UserRole;
  children: React.ReactNode;
}

export function RequireRole({ role, children }: RequireRoleProps) {
  const { user, isLoading } = useAuthStore();

  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-paper">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <span className="font-mono text-muted text-sm">Đang kiểm tra quyền...</span>
        </div>
      </div>
    );
  }

  // Security layer at route level (UX only, real security is on Firebase Rules)
  if (!user || user.role !== role) {
    return <Navigate to="/403" replace />;
  }

  return <>{children}</>;
}
