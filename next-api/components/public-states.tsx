export function LoadingState() {
  return <div className="card animate-pulse text-center text-muted py-8">Loading...</div>
}

export function ErrorState({ message }: { message: string }) {
  return <div className="card text-center text-accent py-8">{message}</div>
}
