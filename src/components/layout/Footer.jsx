import { Link } from 'react-router-dom'

export function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 mt-16">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-center md:text-left">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">ML Visualizer</p>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Open-source interactive visualizations for machine learning and AI.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <Link to="/references" className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors">References</Link>
          <a
            href="https://github.com/your-org/ml-visualizer"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            GitHub
          </a>
          <span>MIT License</span>
          <span>Built with React + D3</span>
        </div>
      </div>
    </footer>
  )
}
