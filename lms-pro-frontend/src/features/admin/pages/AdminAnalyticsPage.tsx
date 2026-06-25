import { BarChart3, Calendar, AlertCircle, ArrowUp } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface AnalyticsCardProps {
  label: string;
  value: string | number;
  unit?: string;
  deltaLabel: string;
  deltaPositive: boolean;
  icon: React.ComponentType<{ className?: string }>;
}

function AnalyticsCard({ label, value, unit, deltaLabel, deltaPositive, icon: Icon }: AnalyticsCardProps) {
  return (
    <div className="bg-paper-raised rounded-md p-4 border border-border flex flex-col justify-between h-36">
      <div className="flex items-center justify-between mb-3">
        <span className="font-body text-xs text-muted uppercase tracking-wide">{label}</span>
        <Icon className="w-4 h-4 text-muted" />
      </div>
      <div>
        <p className="font-mono text-2xl font-medium text-ink mb-1">
          {value}
          {unit && <span className="font-body text-sm text-muted ml-1">{unit}</span>}
        </p>
        <p className={cn(
          'font-body text-xs flex items-center gap-1 font-semibold',
          deltaPositive ? 'text-success' : 'text-danger'
        )}>
          {deltaPositive && <ArrowUp className="w-3 h-3" />}
          {deltaLabel}
        </p>
      </div>
    </div>
  );
}

export function AdminAnalyticsPage() {
  const weekData = [
    { label: 'Thứ 2', value: 120, highlighted: false },
    { label: 'Thứ 3', value: 180, highlighted: false },
    { label: 'Thứ 4', value: 150, highlighted: false },
    { label: 'Thứ 5', value: 240, highlighted: false },
    { label: 'Thứ 6', value: 310, highlighted: false },
    { label: 'Thứ 7 / CN', value: 420, highlighted: true },
  ];
  const maxValue = 450;

  return (
    <div className="space-y-8 animate-in fade-in duration-200 font-sans">
      
      {/* Title */}
      <div className="space-y-1.5">
        <h1 className="font-display text-[26px] font-semibold text-ink tracking-tight leading-8">Báo cáo thống kê</h1>
        <p className="text-xs text-muted">Phân tích chuyên sâu về tương tác người dùng, thời gian học tập và doanh thu khóa học.</p>
      </div>

      {/* Aggregate note alert */}
      <div className="bg-warning-soft border-l-[3px] border-warning rounded-sm p-4 flex items-start gap-3">
        <AlertCircle className="w-4 h-4 text-warning mt-0.5 flex-shrink-0" />
        <div className="space-y-1">
          <p className="font-body font-semibold text-ink text-sm leading-tight">Lưu ý chi phí vận hành (Aggregate Analytics)</p>
          <p className="font-body text-xs text-ink-soft leading-relaxed">
            Hệ thống sử dụng cơ chế <span className="font-mono bg-paper-dim px-1 py-0.5 rounded-sm text-[11px] text-ink font-semibold">aggregateAnalytics</span> chạy tự động mỗi giờ thông qua Google Cloud Scheduler. Điều này tránh việc thực thi các truy vấn nặng trực tiếp trên Firestore khi admin truy cập trang này, giúp tối ưu hóa chi phí đọc/ghi dữ liệu gần như bằng 0 đồng.
          </p>
        </div>
      </div>

      {/* Analytics stats overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <AnalyticsCard 
          label="Tổng giờ xem video" 
          value="1,482" 
          unit="giờ"
          deltaLabel="+12% tăng trưởng tuần này" 
          deltaPositive={true}
          icon={Calendar} 
        />
        <AnalyticsCard 
          label="Tỷ lệ hoàn thành trung bình" 
          value="64.5" 
          unit="%"
          deltaLabel="+2.4% so với tháng trước" 
          deltaPositive={true}
          icon={BarChart3} 
        />
        <AnalyticsCard 
          label="Số lượt thi Quiz thành công" 
          value="924" 
          unit="lượt"
          deltaLabel="+5% hoàn thành đạt điểm chuẩn" 
          deltaPositive={true}
          icon={BarChart3} 
        />
      </div>

      {/* Visual representation block */}
      <div className="w-full bg-paper-raised border border-border rounded-md p-6 space-y-4">
        <h3 className="font-display text-sm font-bold text-ink uppercase tracking-wider">Lượt truy cập hoạt động theo tuần</h3>
        <div className="bg-paper-dim rounded-md p-6">
          <div className="flex items-end justify-between gap-4 h-48">
            {weekData.map((day) => (
              <div key={day.label} className="flex flex-col items-center gap-1.5 flex-1">
                <span className="font-mono text-xs text-ink-soft">{day.value}</span>
                <div
                  className={cn(
                    "w-full rounded-sm transition-all duration-200",
                    day.highlighted ? "bg-accent hover:bg-accent/90" : "bg-ink-soft hover:bg-ink-soft/90"
                  )}
                  style={{ height: `${(day.value / maxValue) * 160}px` }}
                />
                <span className="font-body text-xs text-muted mt-1 whitespace-nowrap">{day.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
}
