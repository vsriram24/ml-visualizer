import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'

export default function NotFoundPage() {
  return (
    <PageWrapper title="404">
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <p className="text-6xl font-bold text-slate-200 dark:text-slate-700 mb-4">404</p>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Page not found</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-sm">
          This page doesn't exist. Perhaps you followed a broken link or the URL has changed.
        </p>
        <Link to="/" className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors focus-ring">
          Back to Home
        </Link>
      </div>
    </PageWrapper>
  )
}
