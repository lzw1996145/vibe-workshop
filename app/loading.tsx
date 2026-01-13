export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-pulse">
      <div className="w-12 h-12 border-4 border-[var(--border)] border-t-foreground rounded-full mb-4 animate-spin"></div>
      <p className="text-[var(--muted-foreground)]">加载中...</p>
    </div>
  )
}
