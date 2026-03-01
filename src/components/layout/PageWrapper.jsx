import { useEffect } from 'react'

export function PageWrapper({ title, children, className = '' }) {
  useEffect(() => {
    if (title) document.title = `${title} — ML Visualizer`
    else document.title = 'ML Visualizer'
  }, [title])

  return (
    <main className={`max-w-screen-xl mx-auto px-4 md:px-8 py-8 ${className}`}>
      {children}
    </main>
  )
}
