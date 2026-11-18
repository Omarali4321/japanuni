'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card' | 'avatar';
  width?: string | number;
  height?: string | number;
  animation?: 'pulse' | 'wave' | 'none';
}

export function Skeleton({
  className,
  variant = 'text',
  width,
  height,
  animation = 'pulse',
  ...props
}: SkeletonProps) {
  const baseStyles = 'bg-muted-200 dark:bg-muted-700 rounded';
  
  const variantStyles = {
    text: 'h-4 w-full',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
    card: 'rounded-xl',
    avatar: 'rounded-full',
  };

  const animationStyles = {
    pulse: 'animate-pulse',
    wave: 'animate-[shimmer_1.5s_infinite]',
    none: '',
  };

  const sizeStyles = {
    width: width ? (typeof width === 'number' ? `${width}px` : width) : undefined,
    height: height ? (typeof height === 'number' ? `${height}px` : height) : undefined,
  };

  return (
    <div
      className={cn(baseStyles, variantStyles[variant], animationStyles[animation], className)}
      style={sizeStyles}
      {...props}
    />
  );
}

// Skeleton for university card
export function UniversityCardSkeleton() {
  return (
    <div className="group relative flex flex-col h-full bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <Skeleton variant="rectangular" className="w-full h-full" animation="wave" />
        <div className="absolute top-3 left-3 flex gap-2">
          <Skeleton variant="circular" width={28} height={28} animation="wave" />
          <Skeleton variant="circular" width={28} height={28} animation="wave" />
        </div>
      </div>
      <div className="p-4 flex flex-col flex-1">
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="circular" width={16} height={16} animation="wave" />
          <Skeleton variant="text" width="60%" height={14} animation="wave" />
        </div>
        <Skeleton variant="text" width="80%" height={24} animation="wave" className="mb-2" />
        <Skeleton variant="text" width="100%" height={14} animation="wave" className="mb-1" />
        <Skeleton variant="text" width="100%" height={14} animation="wave" className="mb-1" />
        <Skeleton variant="text" width="100%" height={14} animation="wave" className="mb-4" />
        <div className="flex flex-wrap gap-2 mb-4">
          <Skeleton variant="circular" width={60} height={20} animation="wave" />
          <Skeleton variant="circular" width={60} height={20} animation="wave" />
          <Skeleton variant="circular" width={60} height={20} animation="wave" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Skeleton variant="text" width="50%" height={14} animation="wave" />
          <Skeleton variant="circular" width={32} height={32} animation="wave" />
        </div>
      </div>
    </div>
  );
}

// Skeleton for dashboard stats cards
export function StatCardSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div>
          <Skeleton variant="text" width="40%" height={14} animation="wave" className="mb-2" />
          <Skeleton variant="text" width="60%" height={32} animation="wave" />
        </div>
        <Skeleton variant="circular" width={48} height={48} animation="wave" />
      </div>
    </div>
  );
}

// Skeleton for table rows
export function TableRowSkeleton({ columns = 5 }: { columns?: number }) {
  return (
    <tr>
      {Array.from({ length: columns }).map((_, i) => (
        <td key={i} className="px-4 py-3">
          <Skeleton variant="text" width="80%" height={16} animation="wave" />
        </td>
      ))}
    </tr>
  );
}

// Skeleton for list items
export function ListItemSkeleton({ hasAvatar = true, lines = 2 }: { hasAvatar?: boolean; lines?: number }) {
  return (
    <div className="flex items-start gap-4 p-4">
      {hasAvatar && <Skeleton variant="avatar" width={48} height={48} animation="wave" />}
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton variant="text" width="40%" height={16} animation="wave" />
        {Array.from({ length: lines - 1 }).map((_, i) => (
          <Skeleton key={i} variant="text" width="100%" height={14} animation="wave" />
        ))}
      </div>
    </div>
  );
}

// Skeleton for form fields
export function FormFieldSkeleton({ label = true, input = true, error = false }: { label?: boolean; input?: boolean; error?: boolean }) {
  return (
    <div className="space-y-1.5">
      {label && <Skeleton variant="text" width="30%" height={14} animation="wave" />}
      {input && <Skeleton variant="rectangular" height={44} animation="wave" />}
      {error && <Skeleton variant="text" width="50%" height={12} animation="wave" />}
    </div>
  );
}

// Skeleton for compare page
export function CompareTableSkeleton({ rows = 3, cols = 4 }: { rows?: number; cols?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr>
            {Array.from({ length: cols + 1 }).map((_, i) => (
              <th key={i} className="px-4 py-3 text-left">
                <Skeleton variant="text" width={i === 0 ? '80%' : '60%'} height={14} animation="wave" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, row) => (
            <tr key={row}>
              {Array.from({ length: cols + 1 }).map((_, col) => (
                <td key={col} className="px-4 py-3">
                  <Skeleton variant="text" width={col === 0 ? '80%' : '60%'} height={16} animation="wave" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// Skeleton for match page results
export function MatchResultSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="avatar" width={64} height={64} animation="wave" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-3">
            <Skeleton variant="text" width="40%" height={20} animation="wave" />
            <Skeleton variant="circular" width={80} height={24} animation="wave" />
          </div>
          <Skeleton variant="text" width="60%" height={14} animation="wave" />
          <Skeleton variant="text" width="100%" height={14} animation="wave" />
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="text-center">
            <Skeleton variant="text" width="50%" height={28} animation="wave" className="mx-auto mb-1" />
            <Skeleton variant="text" width="60%" height={12} animation="wave" className="mx-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}