import { BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-display text-2xl font-bold text-ink">Báo cáo thống kê</h1>
        <p className="text-xs text-ink-soft">Phân tích chuyên sâu về tương tác người dùng, thời gian học tập và doanh thu khóa học.</p>
      </div>

      {/* Aggregate note alert */}
      <div className="flex items-start gap-3 rounded-md bg-accent-soft/15 border border-accent/20 p-4 text-xs sm:text-sm text-ink-soft">
        <AlertCircle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-ink">Lưu ý chi phí vận hành (Aggregate Analytics)</p>
          <p className="leading-relaxed">
            Hệ thống sử dụng cơ chế <span className="font-bold font-mono">aggregateAnalytics</span> chạy tự động mỗi giờ thông qua Google Cloud Scheduler. Điều này tránh việc thực thi các truy vấn nặng trực tiếp trên Firestore khi admin truy cập trang này, giúp tối ưu hóa chi phí đọc/ghi dữ liệu gần như bằng 0 đồng.
          </p>
        </div>
      </div>

      {/* Analytics stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card p-6 space-y-2">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Tổng giờ xem video</span>
            <Calendar className="h-4 w-4 text-accent" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">1,482 giờ</p>
          <div className="text-[10px] text-success flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+12% tăng trưởng tuần này</span>
          </div>
        </div>

        <div className="card p-6 space-y-2">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Tỷ lệ hoàn thành trung bình</span>
            <BarChart3 className="h-4 w-4 text-success" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">64.5%</p>
          <div className="text-[10px] text-success flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+2.4% so với tháng trước</span>
          </div>
        </div>

        <div className="card p-6 space-y-2">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Số lượt thi Quiz thành công</span>
            <BarChart3 className="h-4 w-4 text-warning" />
          </div>
          <p className="font-mono text-2xl font-bold text-ink">924 lượt</p>
          <div className="text-[10px] text-success flex items-center gap-1">
            <TrendingUp className="h-3 w-3" />
            <span>+5% hoàn thành đạt điểm chuẩn</span>
          </div>
        </div>

      </div>

      {/* Visual representation block */}
      <div className="card p-6 space-y-4">
        <h3 className="text-sm font-bold text-ink uppercase tracking-wider">Lượt truy cập hoạt động theo tuần</h3>
        <div className="h-48 bg-paper-dim border border-border rounded flex items-end p-4 gap-2">
          {/* Mock bars */}
          <div className="flex-1 bg-accent/20 border border-accent/30 rounded-t h-1/3 hover:bg-accent/40 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">120</span>
          </div>
          <div className="flex-1 bg-accent/20 border border-accent/30 rounded-t h-1/2 hover:bg-accent/40 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">180</span>
          </div>
          <div className="flex-1 bg-accent/20 border border-accent/30 rounded-t h-2/5 hover:bg-accent/40 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">150</span>
          </div>
          <div className="flex-1 bg-accent/20 border border-accent/30 rounded-t h-2/3 hover:bg-accent/40 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">240</span>
          </div>
          <div className="flex-1 bg-accent/20 border border-accent/30 rounded-t h-4/5 hover:bg-accent/40 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">310</span>
          </div>
          <div className="flex-1 bg-accent border border-accent/30 rounded-t h-full hover:bg-accent/90 transition-all cursor-pointer relative group">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 text-[9px] bg-ink text-white rounded px-1 opacity-0 group-hover:opacity-100 transition-opacity">420</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted font-mono font-bold tracking-widest px-2 uppercase">
          <span>Thứ 2</span>
          <span>Thứ 3</span>
          <span>Thứ 4</span>
          <span>Thứ 5</span>
          <span>Thứ 6</span>
          <span>Thứ 7 / CN</span>
        </div>
      </div>

    </div>
  );
}
