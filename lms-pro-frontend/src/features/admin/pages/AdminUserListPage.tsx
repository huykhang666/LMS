import { useState, useEffect } from 'react';
import { Shield, Ban, MoreVertical, ShieldAlert, CheckCircle, Search, UserCheck } from 'lucide-react';
import { collection, onSnapshot, updateDoc, doc, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase/firestore';

const isMockMode = !import.meta.env.VITE_FIREBASE_API_KEY || 
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('Dummy') ||
                   import.meta.env.VITE_FIREBASE_API_KEY.includes('dummy');

interface UserItem {
  uid: string;
  displayName: string;
  email: string;
  role: 'admin' | 'user';
  avatarUrl: string;
  enrolledCount: number;
  createdAt: string; // Formatting
  status: 'active' | 'banned';
}

export function AdminUserListPage() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fallback mock users
  const mockUsers: UserItem[] = [
    {
      uid: 'mock-uid-admin',
      displayName: 'Quản trị viên',
      email: 'admin@lms.pro',
      role: 'admin',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin',
      enrolledCount: 3,
      createdAt: '24/06/2026',
      status: 'active'
    },
    {
      uid: 'mock-uid-user',
      displayName: 'Học viên Demo',
      email: 'user@lms.pro',
      role: 'user',
      avatarUrl: 'https://api.dicebear.com/7.x/bottts/svg?seed=user',
      enrolledCount: 1,
      createdAt: '25/06/2026',
      status: 'active'
    }
  ];

  // Sync users list with Firestore in real-time
  useEffect(() => {
    if (isMockMode) {
      setUsers(mockUsers);
      setLoading(false);
      return;
    }

    setLoading(true);

    // Set up real-time listener for users
    const unsubscribeUsers = onSnapshot(
      collection(db, 'users'),
      async (snapshot) => {
        try {
          // Fetch all enrollments to count them per user
          const enrollmentsSnap = await getDocs(collection(db, 'enrollments'));
          const enrollments = enrollmentsSnap.docs.map((d) => d.data());

          const usersList: UserItem[] = [];
          snapshot.forEach((userDoc) => {
            const data = userDoc.data();
            
            // Format Timestamp
            let dateStr = 'Mới đăng ký';
            if (data.createdAt) {
              const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              dateStr = date.toLocaleDateString('vi-VN');
            }

            // Count enrollments
            const userEnrollments = enrollments.filter((e) => e.userId === userDoc.id);

            usersList.push({
              uid: userDoc.id,
              displayName: data.displayName || 'Chưa đặt tên',
              email: data.email || 'N/A',
              role: data.role || 'user',
              avatarUrl: data.avatarUrl || 'https://api.dicebear.com/7.x/bottts/svg?seed=' + userDoc.id,
              enrolledCount: userEnrollments.length,
              createdAt: dateStr,
              status: data.status || 'active',
            });
          });

          setUsers(usersList);
        } catch (err) {
          console.error('Error compiling user list:', err);
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error('Error listening to users collection:', error);
        setLoading(false);
      }
    );

    return () => unsubscribeUsers();
  }, []);

  const toggleMenu = (uid: string) => {
    setActiveMenu(activeMenu === uid ? null : uid);
  };

  const handlePromote = async (uid: string) => {
    if (isMockMode) {
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, role: 'admin' } : u))
      );
    } else {
      try {
        await updateDoc(doc(db, 'users', uid), { role: 'admin' });
      } catch (err) {
        console.error('Error promoting user:', err);
        alert('Không thể nâng quyền người dùng này. Vui lòng kiểm tra quyền Firestore của bạn.');
      }
    }
    setActiveMenu(null);
  };

  const handleBan = async (uid: string, currentStatus: 'active' | 'banned') => {
    const nextStatus = currentStatus === 'banned' ? 'active' : 'banned';
    if (isMockMode) {
      setUsers((prev) =>
        prev.map((u) => (u.uid === uid ? { ...u, status: nextStatus } : u))
      );
    } else {
      try {
        await updateDoc(doc(db, 'users', uid), { status: nextStatus });
      } catch (err) {
        console.error('Error toggling ban status:', err);
        alert('Không thể thay đổi trạng thái tài khoản. Vui lòng thử lại.');
      }
    }
    setActiveMenu(null);
  };

  const filteredUsers = users.filter(
    (u) =>
      u.displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-display text-2xl font-bold text-ink">Quản lý học viên</h1>
          <p className="text-xs text-ink-soft">Danh sách tài khoản học viên đăng ký trên hệ thống và phân chia vai trò quản trị.</p>
        </div>
        
        {/* Search bar */}
        <div className="relative w-full sm:w-64">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-muted">
            <Search className="h-4 w-4" />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên hoặc email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              paddingLeft: '2.25rem',
              background: 'var(--color-paper-raised)',
              border: '1px solid var(--color-border)',
              borderRadius: '12px'
            }}
            className="w-full text-xs py-2 px-3 text-ink placeholder-muted focus:outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      {/* Main Card Wrapper */}
      <div 
        style={{
          background: 'var(--color-paper-raised)',
          border: '1px solid var(--color-border)',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(27,42,74,0.02)'
        }}
        className="overflow-hidden"
      >
        {loading ? (
          <div className="p-16 flex flex-col items-center justify-center gap-3">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <span className="font-mono text-muted text-xs">Đang tải tài khoản từ database...</span>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-paper border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                  <th className="p-4 pl-6">Học viên</th>
                  <th className="p-4">Vai trò</th>
                  <th className="p-4">Khóa học đăng ký</th>
                  <th className="p-4">Ngày đăng ký</th>
                  <th className="p-4">Trạng thái</th>
                  <th className="p-4 pr-6 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredUsers.map((user) => (
                  <tr key={user.uid} className="hover:bg-paper/40 transition-colors text-ink-soft">
                    
                    {/* User Profile */}
                    <td className="p-4 pl-6 flex items-center gap-3">
                      <img
                        src={user.avatarUrl}
                        alt={user.displayName}
                        style={{ border: '1px solid var(--color-border)' }}
                        className="h-10 w-10 rounded-full bg-paper object-cover flex-shrink-0"
                      />
                      <div className="space-y-0.5">
                        <p className="font-bold text-ink text-sm leading-tight">{user.displayName}</p>
                        <span className="text-[10px] text-muted font-mono block leading-none">{user.email}</span>
                      </div>
                    </td>

                    {/* Role Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        user.role === 'admin' 
                          ? 'bg-accent/10 border-accent/20 text-accent' 
                          : 'bg-paper border-border text-muted'
                      }`}>
                        {user.role === 'admin' ? (
                          <>
                            <ShieldAlert className="h-3 w-3" />
                            Quản trị viên
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-3 w-3" />
                            Học viên
                          </>
                        )}
                      </span>
                    </td>

                    {/* Enrolled Courses Count */}
                    <td className="p-4 font-mono font-bold text-ink text-sm">
                      {user.enrolledCount} khóa học
                    </td>

                    {/* Registration Date */}
                    <td className="p-4 font-mono text-muted">{user.createdAt}</td>

                    {/* Status Badge */}
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${
                        user.status === 'active' 
                          ? 'bg-success-soft/10 border-success/20 text-success' 
                          : 'bg-danger/10 border-danger/20 text-danger'
                      }`}>
                        {user.status === 'active' ? (
                          <>
                            <CheckCircle className="h-3 w-3" />
                            Hoạt động
                          </>
                        ) : (
                          <>
                            <Ban className="h-3 w-3" />
                            Đã khóa
                          </>
                        )}
                      </span>
                    </td>

                    {/* Actions Menu */}
                    <td className="p-4 pr-6 text-right relative">
                      <button 
                        onClick={() => toggleMenu(user.uid)}
                        className="p-1.5 rounded-lg hover:bg-paper text-ink-soft/80 hover:text-ink transition-colors cursor-pointer"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {activeMenu === user.uid && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                          <div 
                            style={{
                              background: 'var(--color-paper-raised)',
                              border: '1px solid var(--color-border)',
                              boxShadow: '0 8px 24px rgba(27,42,74,0.08)',
                              borderRadius: '12px'
                            }}
                            className="absolute right-4 mt-1 w-44 py-1.5 z-20 overflow-hidden"
                          >
                            {user.role !== 'admin' && (
                              <button
                                onClick={() => handlePromote(user.uid)}
                                className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-bold text-ink-soft hover:bg-paper transition-colors cursor-pointer"
                              >
                                <Shield className="h-4 w-4 text-accent" />
                                Thăng cấp Admin
                              </button>
                            )}
                            <button
                              onClick={() => handleBan(user.uid, user.status)}
                              className="flex w-full items-center gap-2 px-3.5 py-2.5 text-left text-xs font-bold text-danger hover:bg-paper transition-colors cursor-pointer"
                            >
                              <Ban className="h-4 w-4" />
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
        ) : (
          <div className="p-12 flex flex-col items-center justify-center text-center text-ink-soft">
            <Search className="h-8 w-8 text-muted mb-3" />
            <p className="font-bold text-sm text-ink">Không tìm thấy người dùng nào</p>
            <p className="text-xs text-muted mt-1">Vui lòng kiểm tra lại từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>

    </div>
  );
}
