import { useState } from 'react';
import { Shield, Ban, MoreVertical, Search, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

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
    },
    {
      uid: 'user-4',
      displayName: 'Phạm Minh D',
      email: 'minhd@gmail.com',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user-4',
      enrolledCount: 5,
      createdAt: '15/06/2026',
      status: 'active'
    },
    {
      uid: 'user-5',
      displayName: 'Hoàng Lan E',
      email: 'lane@gmail.com',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user-5',
      enrolledCount: 2,
      createdAt: '24/06/2026',
      status: 'active'
    }
  ]);

  const [searchQuery, setSearchQuery] = useState('');
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

  // Filter users based on query
  const filteredUsers = users.filter(user => 
    user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">Quản Lý Học Viên</h1>
          <p className="text-xs text-ink-soft mt-1">Quản lý tài khoản học viên hệ thống, thiết lập quyền quản trị viên hoặc khóa tài khoản.</p>
        </div>

        {/* Live Search Bar */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: 320
        }}>
          <Search size={14} style={{
            position: 'absolute',
            left: 12,
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-ink-soft)'
          }} />
          <input
            type="text"
            placeholder="Tìm kiếm theo tên hoặc email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              fontSize: 12,
              padding: '8px 12px 8px 34px',
              borderRadius: 8,
              border: '1px solid var(--color-border)',
              backgroundColor: 'var(--color-paper-raised)',
              color: 'var(--color-ink)',
              outline: 'none',
              transition: 'border-color 0.2s ease'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--color-accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
          />
        </div>
      </div>

      {/* Main Table Card */}
      <div className="card overflow-hidden" style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
        <div className="overflow-x-auto">
          {filteredUsers.length > 0 ? (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper-dim border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                  <th className="p-4">Học viên</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Khóa học đăng ký</th>
                  <th className="p-4">Ngày tham gia</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
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
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        user.role === 'admin' 
                          ? 'bg-orange-500/10 text-orange-500 border border-orange-500/20' 
                          : 'bg-paper-dim border border-border text-muted'
                      }`}>
                        {user.role === 'admin' ? (
                          <>
                            <ShieldCheck size={10} />
                            Quản trị
                          </>
                        ) : 'Học viên'}
                      </span>
                    </td>
                    <td className="p-4 font-mono font-bold text-ink">{user.enrolledCount} khóa học</td>
                    <td className="p-4 font-mono">{user.createdAt}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        user.status === 'active' 
                          ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                          : 'bg-red-500/10 text-red-500 border border-red-500/20'
                      }`}>
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle2 size={10} />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <AlertTriangle size={10} />
                            Đã khóa
                          </>
                        )}
                      </span>
                    </td>
                    <td className="p-4 text-right relative">
                      <button 
                        onClick={() => toggleMenu(user.uid)}
                        className="p-1.5 rounded hover:bg-paper-dim text-ink-soft transition-colors"
                        style={{ cursor: 'pointer' }}
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
                                className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-ink hover:bg-paper-dim transition-colors"
                                style={{ cursor: 'pointer' }}
                              >
                                <Shield className="h-3.5 w-3.5 text-accent" />
                                Nâng quyền Admin
                              </button>
                            )}
                            <button
                              onClick={() => handleBan(user.uid)}
                              className="flex w-full items-center gap-2 px-3 py-2 text-left text-xs font-semibold text-red-500 hover:bg-paper-dim transition-colors"
                              style={{ cursor: 'pointer' }}
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
          ) : (
            <div className="p-12 text-center text-ink-soft">
              <Search className="h-8 w-8 text-muted mx-auto mb-3" />
              <p className="font-semibold text-sm">Không tìm thấy người dùng</p>
              <p className="text-xs text-muted mt-1">Thử thay đổi từ khóa tìm kiếm của bạn.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
