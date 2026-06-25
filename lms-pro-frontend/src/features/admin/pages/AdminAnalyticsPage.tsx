import { BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      
      {/* Title */}
      <div className="space-y-1">
        <h1 className="font-display text-3xl font-extrabold text-ink tracking-tight">Báo cáo thống kê</h1>
        <p className="text-xs text-muted">Phân tích chuyên sâu về tương tác người dùng, thời gian học tập và doanh thu khóa học.</p>
      </div>

      {/* Aggregate note alert */}
      <div className="flex items-start gap-4 rounded-2xl bg-violet-50/50 border border-violet-100 p-5 text-sm text-ink-soft">
        <AlertCircle className="h-6 w-6 text-accent shrink-0 mt-0.5" strokeWidth={2.5} />
        <div className="space-y-1">
          <p className="font-extrabold text-violet-900 text-base">Lưu ý chi phí vận hành (Aggregate Analytics)</p>
          <p className="leading-relaxed text-xs text-violet-800/90">
            Hệ thống sử dụng cơ chế <span className="font-bold font-mono bg-violet-100 border border-violet-200/50 px-1.5 py-0.5 rounded text-[10px]">aggregateAnalytics</span> chạy tự động mỗi giờ thông qua Google Cloud Scheduler. Điều này tránh việc thực thi các truy vấn nặng trực tiếp trên Firestore khi admin truy cập trang này, giúp tối ưu hóa chi phí đọc/ghi dữ liệu gần như bằng 0 đồng.
          </p>
        </div>
      </div>

      {/* Analytics stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="card p-6 space-y-3.5 border-l-4 border-l-violet-600">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Tổng giờ xem video</span>
            <Calendar className="h-5 w-5 text-accent" />
          </div>
          <p className="font-mono text-3xl font-black text-ink">1,482 giờ</p>
          <div className="text-[10px] text-success flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% tăng trưởng tuần này</span>
          </div>
        </div>

        <div className="card p-6 space-y-3.5 border-l-4 border-l-emerald-500">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Tỷ lệ hoàn thành trung bình</span>
            <BarChart3 className="h-5 w-5 text-emerald-500" />
          </div>
          <p className="font-mono text-3xl font-black text-ink">64.5%</p>
          <div className="text-[10px] text-success flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2.4% so với tháng trước</span>
          </div>
        </div>

        <div className="card p-6 space-y-3.5 border-l-4 border-l-amber-500">
          <div className="flex justify-between items-center text-muted font-sans font-bold uppercase tracking-wider text-[10px]">
            <span>Số lượt thi Quiz thành công</span>
            <BarChart3 className="h-5 w-5 text-amber-500" />
          </div>
          <p className="font-mono text-3xl font-black text-ink">924 lượt</p>
          <div className="text-[10px] text-success flex items-center gap-1 font-bold">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5% hoàn thành đạt điểm chuẩn</span>
          </div>
        </div>

      </div>

      {/* Visual representation block */}
      <div className="card p-8 space-y-6">
        <h3 className="text-sm font-extrabold text-ink uppercase tracking-wider">Lượt truy cập hoạt động theo tuần</h3>
        <div className="h-60 bg-slate-50 border border-slate-100 rounded-2xl flex items-end p-6 gap-3.5">
          {/* Mock bars */}
          <div className="flex-1 bg-gradient-to-t from-accent to-indigo-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer relative group h-1/3">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">120 lượt</span>
          </div>
          <div className="flex-1 bg-gradient-to-t from-accent to-indigo-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer relative group h-1/2">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">180 lượt</span>
          </div>
          <div className="flex-1 bg-gradient-to-t from-accent to-indigo-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer relative group h-2/5">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">150 lượt</span>
          </div>
          <div className="flex-1 bg-gradient-to-t from-accent to-indigo-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer relative group h-2/3">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">240 lượt</span>
          </div>
          <div className="flex-1 bg-gradient-to-t from-accent to-indigo-500 rounded-t-xl hover:opacity-90 transition-all cursor-pointer relative group h-4/5">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">310 lượt</span>
          </div>
          <div className="flex-1 bg-gradient-to-t from-accent via-violet-600 to-indigo-600 rounded-t-xl hover:opacity-95 transition-all cursor-pointer relative group h-full shadow-md shadow-accent/15">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-bold bg-ink text-white rounded-lg py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">420 lượt</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted font-mono font-bold tracking-widest px-4 uppercase">
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
