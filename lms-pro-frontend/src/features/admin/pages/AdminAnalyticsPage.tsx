import { BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react';

export function AdminAnalyticsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      
      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="font-display text-[26px] font-semibold text-slate-900 tracking-tight leading-8">Báo cáo thống kê</h1>
        <p className="text-xs text-slate-500">Phân tích chuyên sâu về tương tác người dùng, thời gian học tập và doanh thu khóa học.</p>
      </div>

      {/* Aggregate note alert */}
      <div className="flex items-start gap-4 rounded-xl bg-slate-50 border border-slate-200 p-5 text-sm text-slate-700">
        <AlertCircle className="h-5 w-5 text-indigo-600 shrink-0 mt-0.5" strokeWidth={2} />
        <div className="space-y-1">
          <p className="font-semibold text-slate-900 text-sm">Lưu ý chi phí vận hành (Aggregate Analytics)</p>
          <p className="leading-relaxed text-xs text-slate-500">
            Hệ thống sử dụng cơ chế <span className="font-mono bg-slate-200/60 px-1.5 py-0.5 rounded text-[10px] text-slate-800 font-semibold">aggregateAnalytics</span> chạy tự động mỗi giờ thông qua Google Cloud Scheduler. Điều này tránh việc thực thi các truy vấn nặng trực tiếp trên Firestore khi admin truy cập trang này, giúp tối ưu hóa chi phí đọc/ghi dữ liệu gần như bằng 0 đồng.
          </p>
        </div>
      </div>

      {/* Analytics stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="p-6 border border-indigo-200 bg-indigo-50/50 rounded-xl flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex items-center gap-2">
            <Calendar className="h-4.5 w-4.5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Tổng giờ xem video
            </span>
          </div>
          <p className="font-mono text-3xl font-semibold leading-none mt-4 text-indigo-600">1,482 giờ</p>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+12% tăng trưởng tuần này</span>
          </div>
        </div>

        <div className="p-6 border border-indigo-200 bg-indigo-50/50 rounded-xl flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Tỷ lệ hoàn thành trung bình
            </span>
          </div>
          <p className="font-mono text-3xl font-semibold leading-none mt-4 text-indigo-600">64.5%</p>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+2.4% so với tháng trước</span>
          </div>
        </div>

        <div className="p-6 border border-indigo-200 bg-indigo-50/50 rounded-xl flex flex-col justify-between h-36 transition-all duration-200">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-4.5 w-4.5 text-indigo-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
              Số lượt thi Quiz thành công
            </span>
          </div>
          <p className="font-mono text-3xl font-semibold leading-none mt-4 text-indigo-600">924 lượt</p>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 font-bold mt-2">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+5% hoàn thành đạt điểm chuẩn</span>
          </div>
        </div>

      </div>

      {/* Visual representation block */}
      <div className="border border-slate-200 bg-white rounded-xl p-8 space-y-6">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Lượt truy cập hoạt động theo tuần</h3>
        <div className="h-60 bg-slate-50 border border-slate-100 rounded-xl flex items-end p-6 gap-3.5">
          {/* Mock bars */}
          <div className="flex-1 bg-slate-200 hover:bg-slate-350 rounded-t-lg transition-all cursor-pointer relative group h-1/3">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">120 lượt</span>
          </div>
          <div className="flex-1 bg-slate-200 hover:bg-slate-350 rounded-t-lg transition-all cursor-pointer relative group h-1/2">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">180 lượt</span>
          </div>
          <div className="flex-1 bg-slate-200 hover:bg-slate-350 rounded-t-lg transition-all cursor-pointer relative group h-2/5">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">150 lượt</span>
          </div>
          <div className="flex-1 bg-indigo-500/80 hover:bg-indigo-550 rounded-t-lg transition-all cursor-pointer relative group h-2/3">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">240 lượt</span>
          </div>
          <div className="flex-1 bg-indigo-500/80 hover:bg-indigo-550 rounded-t-lg transition-all cursor-pointer relative group h-4/5">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">310 lượt</span>
          </div>
          <div className="flex-1 bg-indigo-650 hover:bg-indigo-700 rounded-t-lg transition-all cursor-pointer relative group h-full shadow-sm">
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 text-[10px] font-semibold bg-slate-900 text-white rounded-md py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm whitespace-nowrap z-10">420 lượt</span>
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-slate-400 font-mono font-bold tracking-widest px-4 uppercase">
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
