import { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  ArrowUpRight, 
  TrendingUp, 
  ShoppingBag, 
  Calendar,
  Search,
  CheckCircle2,
  FileText
} from 'lucide-react';
import { useCourseStore } from '@/store/courseStore';

export function AdminDashboardPage() {
  const courses = useCourseStore((s) => s.courses);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');

  // Hardcoded premium mock financial stats
  const stats = {
    totalRevenue: '148,520,000đ',
    revenueGrowth: '+12.4%',
    activeStudents: '1,248',
    studentsGrowth: '+8.3%',
    courseSales: '342',
    salesGrowth: '+15.2%',
    avgOrderValue: '434,000đ',
  };

  // Mock revenue transactions log
  const transactions = [
    {
      id: 'tx-109',
      studentName: 'Nguyễn Văn A',
      studentEmail: 'vana@gmail.com',
      courseTitle: 'React & TypeScript Thực Chiến',
      amount: '499.000đ',
      date: '10 phút trước',
      status: 'success'
    },
    {
      id: 'tx-108',
      studentName: 'Trần Thị B',
      studentEmail: 'thib@gmail.com',
      courseTitle: 'Bí Quyết Giao Tiếp Tiếng Anh',
      amount: '399.000đ',
      date: '1 giờ trước',
      status: 'success'
    },
    {
      id: 'tx-107',
      studentName: 'Lê Hoàng C',
      studentEmail: 'hoangc@gmail.com',
      courseTitle: 'Xây Dựng Hệ Thống DevOps Hiện Đại',
      amount: '699.000đ',
      date: '4 giờ trước',
      status: 'success'
    },
    {
      id: 'tx-106',
      studentName: 'Phạm Minh D',
      studentEmail: 'minhd@gmail.com',
      courseTitle: 'Làm Chủ AI và Học Máy 2026',
      amount: '899.000đ',
      date: 'Hôm qua',
      status: 'success'
    },
    {
      id: 'tx-105',
      studentName: 'Hoàng Lan E',
      studentEmail: 'lane@gmail.com',
      courseTitle: 'Kỹ Năng Mềm Cho Lập Trình Viên',
      amount: '299.000đ',
      date: '2 ngày trước',
      status: 'success'
    }
  ];

  // Best selling courses mock data
  const bestSellers = [
    { title: 'React & TypeScript Thực Chiến', sales: 120, revenue: '59,880,000đ', price: '499.000đ', rate: '92%' },
    { title: 'Làm Chủ AI và Học Máy 2026', sales: 85, revenue: '76,415,000đ', price: '899.000đ', rate: '88%' },
    { title: 'Bí Quyết Giao Tiếp Tiếng Anh', sales: 74, revenue: '29,526,000đ', price: '399.000đ', rate: '95%' },
    { title: 'Xây Dựng Hệ Thống DevOps Hiện Đại', sales: 63, revenue: '44,037,000đ', price: '699.000đ', rate: '85%' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* Upper header action row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink tracking-tight">Tổng Quan Báo Cáo Doanh Thu</h1>
          <p className="text-xs text-ink-soft mt-1">Quản lý hiệu suất tài chính, lượng bán khóa học và các chỉ số hoạt động.</p>
        </div>
        
        {/* Date Filter selector */}
        <div style={{
          display: 'flex', 
          backgroundColor: 'var(--color-paper-raised)', 
          border: '1px solid var(--color-border)',
          borderRadius: 8,
          padding: 3
        }}>
          {(['week', 'month', 'year'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '6px 12px',
                borderRadius: 6,
                cursor: 'pointer',
                backgroundColor: timeRange === range ? 'var(--color-accent)' : 'transparent',
                color: timeRange === range ? '#fff' : 'var(--color-ink-soft)',
                transition: 'all 0.2s ease-out'
              }}
            >
              {range === 'week' ? 'Tuần này' : range === 'month' ? 'Tháng này' : 'Năm nay'}
            </button>
          ))}
        </div>
      </div>

      {/* Analytics KPI Dashboard Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Card 1: Total Revenue */}
        <div className="card p-6 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md" 
             style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">Tổng Doanh Thu</span>
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/15">
              <DollarSign size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-2xl font-bold text-ink leading-tight">{stats.totalRevenue}</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
              <TrendingUp size={12} />
              <span>{stats.revenueGrowth} so với tháng trước</span>
            </div>
          </div>
        </div>

        {/* Card 2: Active Students */}
        <div className="card p-6 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md"
             style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">Học Viên Hoạt Động</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/15">
              <Users size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-2xl font-bold text-ink leading-tight">{stats.activeStudents}</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
              <TrendingUp size={12} />
              <span>{stats.studentsGrowth} đăng ký mới</span>
            </div>
          </div>
        </div>

        {/* Card 3: Course Sales */}
        <div className="card p-6 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md"
             style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">Đơn Hàng Thành Công</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/15">
              <ShoppingBag size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-2xl font-bold text-ink leading-tight">{stats.courseSales}</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-emerald-500 font-bold">
              <TrendingUp size={12} />
              <span>{stats.salesGrowth} lượt thanh toán</span>
            </div>
          </div>
        </div>

        {/* Card 4: Avg Order Value */}
        <div className="card p-6 relative overflow-hidden transition-all hover:translate-y-[-2px] hover:shadow-md"
             style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-ink-soft uppercase font-bold tracking-wider">Giá Trị Đơn Trung Bình</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/15">
              <TrendingUp size={16} />
            </div>
          </div>
          <div className="mt-4">
            <p className="font-mono text-2xl font-bold text-ink leading-tight">{stats.avgOrderValue}</p>
            <div className="flex items-center gap-1 mt-2 text-[10px] text-ink-soft">
              <span>Được tính trên các khóa trả phí</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Graphs Row (Custom Clean SVG Chart) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Revenue Graph */}
        <div className="lg:col-span-2 card p-6 space-y-6" style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Biểu đồ doanh thu</h3>
              <p className="text-[11px] text-ink-soft">Thống kê doanh thu theo tuần gần nhất (đơn vị: Triệu VNĐ)</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-accent" />
              <span className="text-[10px] font-bold text-ink-soft uppercase">Doanh thu thật</span>
            </div>
          </div>

          {/* SVG Line / Area Graph */}
          <div className="relative h-64 w-full flex items-end">
            <svg viewBox="0 0 700 240" className="w-full h-full">
              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.25" />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="40" x2="700" y2="40" stroke="var(--color-border)" strokeDasharray="4 4" />
              <line x1="0" y1="90" x2="700" y2="90" stroke="var(--color-border)" strokeDasharray="4 4" />
              <line x1="0" y1="140" x2="700" y2="140" stroke="var(--color-border)" strokeDasharray="4 4" />
              <line x1="0" y1="190" x2="700" y2="190" stroke="var(--color-border)" strokeDasharray="4 4" />

              {/* Filled Area */}
              <path
                d="M 50,190 L 150,140 L 250,160 L 350,100 L 450,120 L 550,60 L 650,45 L 650,210 L 50,210 Z"
                fill="url(#chartGradient)"
              />

              {/* Connecting Line */}
              <path
                d="M 50,190 L 150,140 L 250,160 L 350,100 L 450,120 L 550,60 L 650,45"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Data Points / Circles */}
              <circle cx="50" cy="190" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="150" cy="140" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="250" cy="160" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="350" cy="100" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="450" cy="120" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="550" cy="60" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              <circle cx="650" cy="45" r="5" fill="#fff" stroke="var(--color-accent)" strokeWidth="3" />
              
              {/* Values text label */}
              <text x="50" y="170" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">12M</text>
              <text x="150" y="120" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">18M</text>
              <text x="250" y="140" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">15M</text>
              <text x="350" y="80" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">28M</text>
              <text x="450" y="100" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">24M</text>
              <text x="550" y="40" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">38M</text>
              <text x="650" y="25" fontSize="10" fontWeight="bold" fill="var(--color-ink)" textAnchor="middle">45M</text>
            </svg>
          </div>

          {/* Graph labels */}
          <div className="flex justify-between text-[10px] text-ink-soft font-bold font-mono px-6">
            <span>T2</span>
            <span>T3</span>
            <span>T4</span>
            <span>T5</span>
            <span>T6</span>
            <span>T7</span>
            <span>CN</span>
          </div>
        </div>

        {/* Right 1 Column: Top Courses List */}
        <div className="card p-6 space-y-5" style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
          <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Khóa học bán chạy</h3>
          
          <div className="divide-y divide-border flex flex-col gap-4">
            {bestSellers.map((course, idx) => (
              <div key={idx} className="pt-3 first:pt-0 flex items-center justify-between gap-4">
                <div className="space-y-1 max-w-[170px]">
                  <p className="font-bold text-xs text-ink truncate leading-tight">{course.title}</p>
                  <span className="text-[10px] text-ink-soft">Tỷ lệ học xong: <strong>{course.rate}</strong></span>
                </div>
                <div className="text-right">
                  <p className="font-mono text-xs font-bold text-ink">{course.revenue}</p>
                  <span className="text-[10px] text-muted font-mono">{course.sales} đơn</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent transactions log */}
      <div className="card p-6 space-y-4" style={{ background: 'var(--color-paper-raised)', border: '1px solid var(--color-border)' }}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Lịch sử thanh toán gần đây</h3>
            <p className="text-[11px] text-ink-soft">Giao dịch mua khóa học của học viên cập nhật thời gian thực.</p>
          </div>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-paper-dim border-b border-border text-ink-soft uppercase font-bold tracking-wider">
                <th className="p-4">Mã giao dịch</th>
                <th className="p-4">Học viên</th>
                <th className="p-4">Khóa học</th>
                <th className="p-4">Giá tiền</th>
                <th className="p-4">Thời gian</th>
                <th className="p-4 text-right">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-paper-dim/30 transition-colors text-ink-soft">
                  <td className="p-4 font-mono font-bold text-ink">{tx.id}</td>
                  <td className="p-4">
                    <div className="font-bold text-ink">{tx.studentName}</div>
                    <div className="text-[10px] text-muted font-mono">{tx.studentEmail}</div>
                  </td>
                  <td className="p-4 font-semibold text-ink">{tx.courseTitle}</td>
                  <td className="p-4 font-mono font-bold text-ink">{tx.amount}</td>
                  <td className="p-4">{tx.date}</td>
                  <td className="p-4 text-right">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle2 size={10} />
                      Thành công
                    </span>
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
