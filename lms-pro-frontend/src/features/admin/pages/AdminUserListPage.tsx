import { useState } from 'react';
import { Shield, Ban, MoreVertical } from 'lucide-react';

export function AdminUserListPage() {
  const [users, setUsers] = useState([
    {
      uid: 'user-1',
      displayName: 'Nguyễn Văn A',
      email: 'vana@gmail.com',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user-1',
      enrolledCount: 3,
      createdAt: '20/06/2026',
      status: 'active'
    },
    {
      uid: 'user-2',
      displayName: 'Trần Thị B',
      email: 'thib@gmail.com',
      role: 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user-2',
      enrolledCount: 1,
      createdAt: '18/06/2026',
      status: 'active'
    },
    {
      uid: 'user-3',
      displayName: 'Lê Hoàng C',
      email: 'hoangc@gmail.com',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user-3',
      enrolledCount: 0,
      createdAt: '22/06/2026',
      status: 'banned'
    }
  ]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  const toggleMenu = (uid: string) => {
    setActiveMenu(activeMenu === uid ? null : uid);
  };

  const handlePromote = (uid: string) => {
    setUsers(
      users.map((u) => (u.uid === uid ? { ...u, role: 'admin' } : u))
    );
    setActiveMenu(null);
  };

  const handleBan = (uid: string) => {
    setUsers(
      users.map((u) => {
        if (u.uid === uid) {
          const nextStatus = u.status === 'banned' ? 'active' : 'banned';
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
    setActiveMenu(null);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-ink">Quản lý học viên</h1>
        <p className="text-xs text-ink-soft">Danh sách tài khoản học viên trong hệ thống và phân phối vai trò.</p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-paper-dim border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                <th className="p-4">Tài khoản</th>
                <th className="p-4">Vai trò</th>
                <th className="p-4">Số khóa học đăng ký</th>
                <th className="p-4">Ngày đăng ký</th>
                <th className="p-4">Trạng thái</th>
                <th className="p-4 text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => (
                <tr key={user.uid} className="hover:bg-paper-dim/30 transition-colors text-ink-soft">
                  <td className="p-4 flex items-center gap-3">
                    <img
                      src={user.avatarUrl}
                      alt="Avatar"
                      className="h-9 w-9 rounded-full border border-border bg-paper-dim"
                    />
                    <div className="space-y-0.5">
                      <p className="font-bold text-ink text-sm leading-none">{user.displayName}</p>
                      <span className="text-[10px] text-muted font-mono">{user.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      user.role === 'admin' 
                        ? 'bg-accent/10 border border-accent/20 text-accent' 
                        : 'bg-paper-dim border border-border text-muted'
                    }`}>
                      {user.role === 'admin' ? 'Quản trị viên' : 'Học viên'}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-ink">{user.enrolledCount} khóa</td>
                  <td className="p-4 font-mono">{user.createdAt}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      user.status === 'active' ? 'bg-success-soft text-success' : 'bg-danger/10 text-danger'
                    }`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Đã khóa'}
                    </span>
                  </td>
                  <td className="p-4 text-right relative">
                    <button 
                      onClick={() => toggleMenu(user.uid)}
                      className="p-1.5 rounded hover:bg-paper-dim text-ink-soft transition-colors"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>

                    {activeMenu === user.uid && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                        <div className="absolute right-4 mt-1 w-44 rounded border border-border bg-paper-raised py-1 shadow-lg z-20">
                          {user.role !== 'admin' && (
                            <button
                              onClick={() => handlePromote(user.uid)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-ink-soft hover:bg-paper-dim transition-colors"
                            >
                              <Shield className="h-3.5 w-3.5 text-accent" />
                              Nâng quyền Admin
                            </button>
                          )}
                          <button
                            onClick={() => handleBan(user.uid)}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-danger hover:bg-paper-dim transition-colors"
                          >
                            <Ban className="h-3.5 w-3.5" />
                            {user.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa'}
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
