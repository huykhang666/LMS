import { LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '@/shared/utils/cn';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  actionLink?: string;
  variant?: 'admin' | 'learner';
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  onAction,
  actionLink,
  variant = 'admin',
}: EmptyStateProps) {
  const buttonClass = cn(
    "font-body text-sm font-medium px-4 py-2 rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer",
    variant === 'learner' 
      ? "bg-accent hover:bg-accent/90 text-paper-raised" 
      : "bg-ink hover:bg-ink-soft text-paper-raised"
  );
  
  return (
    <div className="border-2 border-dashed border-border rounded-md py-12 px-6 text-center max-w-md mx-auto">
      <Icon className="w-8 h-8 text-muted mx-auto mb-3" />
      <p className="font-display text-lg text-ink mb-1">
        {title}
      </p>
      <p className="font-body text-sm text-muted mb-4">
        {description}
      </p>
      {actionLabel && (
        actionLink ? (
          <Link to={actionLink} className={buttonClass}>
            {actionLabel}
          </Link>
        ) : (
          <button onClick={onAction} className={buttonClass}>
            {actionLabel}
          </button>
        )
      )}
    </div>
  );
}
