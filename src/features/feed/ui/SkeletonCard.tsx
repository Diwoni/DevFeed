export function SkeletonCard() {
  return (
    <div className="flex flex-col gap-4 rounded-[14px] border border-[var(--border)] bg-[var(--surface)] p-5">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        <div className="h-4 w-16 animate-pulse rounded-full bg-[var(--surface-muted)]" />
      </div>
      <div className="space-y-2">
        <div className="h-6 w-3/4 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        <div className="h-4 w-full animate-pulse rounded-full bg-[var(--surface-muted)]" />
        <div className="h-4 w-5/6 animate-pulse rounded-full bg-[var(--surface-muted)]" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--surface-muted)]" />
          <div className="h-6 w-16 animate-pulse rounded-full bg-[var(--surface-muted)]" />
        </div>
        <div className="h-6 w-20 animate-pulse rounded-full bg-[var(--surface-muted)]" />
      </div>
    </div>
  )
}
