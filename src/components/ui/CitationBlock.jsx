import { useState } from 'react'
import { getCitation } from '../../hooks/useCitations'

export function CitationBlock({ citeKey, inline = true }) {
  const [open, setOpen] = useState(false)
  const cite = getCitation(citeKey)
  if (!cite) return null

  const authorStr = cite.authors.length > 3
    ? `${cite.authors[0]} et al.`
    : cite.authors.join(', ')

  return (
    <span className="relative inline-block">
      <button
        onClick={() => setOpen(o => !o)}
        className="text-brand-500 hover:text-brand-700 dark:hover:text-brand-300 text-xs align-super ml-0.5 focus-ring rounded"
        aria-label={`Citation: ${cite.title}`}
        aria-expanded={open}
      >
        [{citeKey.slice(0, 4)}]
      </button>
      {open && (
        <div className="absolute z-50 bottom-6 left-0 w-72 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl p-3 text-left">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-2 right-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            aria-label="Close citation"
          >
            ✕
          </button>
          <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 pr-4">{cite.title}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">{authorStr} ({cite.year})</p>
          <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5 italic">{cite.venue}</p>
          {cite.url && (
            <a
              href={cite.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brand-500 hover:underline mt-1 block"
            >
              View source →
            </a>
          )}
        </div>
      )}
    </span>
  )
}
