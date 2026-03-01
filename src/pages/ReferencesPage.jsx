import { useState, useMemo } from 'react'
import { PageWrapper } from '../components/layout/PageWrapper'
import { citations } from '../data/citations-registry'

const TYPE_LABELS = {
  conference: 'Conference Paper',
  journal: 'Journal Article',
  book: 'Book',
  online: 'Online Article',
  preprint: 'Preprint',
  techreport: 'Technical Report',
}

const TYPE_COLORS = {
  conference: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
  journal:    'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300',
  book:       'bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300',
  online:     'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300',
  preprint:   'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300',
  techreport: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
}

export default function ReferencesPage() {
  const [query, setQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')

  const allCites = useMemo(() => Object.values(citations).sort((a, b) => b.year - a.year || a.authors[0].localeCompare(b.authors[0])), [])
  const types = useMemo(() => ['all', ...new Set(allCites.map(c => c.type))], [allCites])

  const filtered = useMemo(() => {
    const q = query.toLowerCase()
    return allCites.filter(c => {
      const matchType = typeFilter === 'all' || c.type === typeFilter
      const matchQ = !q || c.title.toLowerCase().includes(q) || c.authors.some(a => a.toLowerCase().includes(q)) || String(c.year).includes(q)
      return matchType && matchQ
    })
  }, [allCites, query, typeFilter])

  return (
    <PageWrapper title="References">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">References</h1>
          <p className="text-slate-600 dark:text-slate-400">
            All sources cited throughout ML Visualizer, including {allCites.length} references from papers, textbooks, and online resources.
          </p>
        </div>

        {/* Search + filter */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <input
            type="search"
            placeholder="Search by title, author, or year…"
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 text-sm bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
          />
          <div className="flex gap-1.5 flex-wrap">
            {types.map(t => (
              <button
                key={t}
                onClick={() => setTypeFilter(t)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize
                  ${typeFilter === t
                    ? 'bg-brand-500 text-white'
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Citation list */}
        <div className="space-y-3">
          {filtered.map(c => {
            const authorStr = c.authors.length > 3
              ? `${c.authors.slice(0, 3).join(', ')}, et al.`
              : c.authors.join(', ')
            return (
              <div key={c.id} className="p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl hover:border-brand-300 dark:hover:border-brand-700 transition-colors">
                <div className="flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      {c.url ? (
                        <a href={c.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-sm text-slate-900 dark:text-slate-100 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
                          {c.title}
                        </a>
                      ) : (
                        <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{c.title}</span>
                      )}
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${TYPE_COLORS[c.type] || TYPE_COLORS.techreport}`}>
                        {TYPE_LABELS[c.type] || c.type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400">{authorStr}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-500 mt-0.5">
                      {c.year} · <span className="italic">{c.venue}</span>
                    </p>
                  </div>
                  {c.url && (
                    <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label="Open source"
                      className="shrink-0 text-slate-400 hover:text-brand-500 transition-colors">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <p className="text-center text-slate-400 py-12">No references match your search.</p>
          )}
        </div>
      </div>
    </PageWrapper>
  )
}
