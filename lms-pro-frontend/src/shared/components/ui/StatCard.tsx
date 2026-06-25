import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  accented?: boolean;
}

export function StatCard({ label, value, icon: Icon, accented = false }: StatCardProps) {
  return (
    <div
      className={cn(
        'bg-paper-raised rounded-md p-4 border transition-all duration-200',
        accented ? 'border-accent' : 'border-border'
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="w-4 h-4 text-muted" />
        <span className="font-body text-xs text-muted uppercase tracking-wide">
          {label}
        </span>
      </div>
      <p className="font-mono text-2xl font-medium text-ink">{value}</p>
    </div>
  );
}
