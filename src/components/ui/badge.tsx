export function Badge({ children, className = "" }: { children: React.ReactNode, className?: string }) {
    return <span className={`inline-block px-2 py-1 border-blue-600 rounded text-sm font-medium ${className}`}>{children}</span>
  }
  