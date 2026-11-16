export function LoadingState() {
  return <div className="glass-card animate-pulse text-center text-ink-800/60 dark:text-ink-50/60">Loading...</div>
}

export function ErrorState({ message }: { message: string }) {
  return <div className="glass-card text-center text-red-500">{message}</div>
}
