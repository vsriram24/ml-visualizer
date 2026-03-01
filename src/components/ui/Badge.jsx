const variants = {
  live:         'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
  precomputed:  'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300',
  interactive:  'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300',
  supervised:   'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300',
  unsupervised: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300',
  default:      'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

export function Badge({ children, variant = 'default' }) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variants[variant] || variants.default}`}>
      {children}
    </span>
  )
}
