import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'
import { SECTIONS, COLOR_MAP } from '../data/algorithms-meta'

const ICONS = {
  fundamentals: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" />
    </svg>
  ),
  predictive: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 14.25v2.25m3-4.5v4.5m3-6.75v6.75m3-9v9M6 20.25h12A2.25 2.25 0 0020.25 18V6A2.25 2.25 0 0018 3.75H6A2.25 2.25 0 003.75 6v12A2.25 2.25 0 006 20.25z" />
    </svg>
  ),
  'deep-learning': (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
    </svg>
  ),
  generative: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  ),
  applications: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 6.087c0-.355.186-.676.401-.959.221-.29.349-.634.349-1.003 0-1.036-1.007-1.875-2.25-1.875s-2.25.84-2.25 1.875c0 .369.128.713.349 1.003.215.283.401.604.401.959v0a.64.64 0 01-.657.643 48.39 48.39 0 01-4.163-.3c.186 1.613.293 3.25.315 4.907a.656.656 0 01-.658.663v0c-.355 0-.676-.186-.959-.401a1.647 1.647 0 00-1.003-.349c-1.036 0-1.875 1.007-1.875 2.25s.84 2.25 1.875 2.25c.369 0 .713-.128 1.003-.349.283-.215.604-.401.959-.401v0c.31 0 .555.26.532.57a48.039 48.039 0 01-.642 5.056c1.518.19 3.058.309 4.616.354a.64.64 0 00.657-.643v0c0-.355-.186-.676-.401-.959a1.647 1.647 0 01-.349-1.003c0-1.035 1.008-1.875 2.25-1.875 1.243 0 2.25.84 2.25 1.875 0 .369-.128.713-.349 1.003-.215.283-.4.604-.4.959v0c0 .333.277.599.61.58a48.1 48.1 0 005.427-.63 48.05 48.05 0 00.582-4.717.532.532 0 00-.533-.57v0c-.355 0-.676.186-.959.401-.29.221-.634.349-1.003.349-1.035 0-1.875-1.007-1.875-2.25s.84-2.25 1.875-2.25c.37 0 .713.128 1.003.349.283.215.604.401.959.401v0a.656.656 0 00.658-.663 48.422 48.422 0 00-.37-5.36c-1.886.342-3.81.574-5.766.689a.578.578 0 01-.61-.58v0z" />
    </svg>
  ),
}

const SECTION_COUNTS = {
  fundamentals: 3,
  predictive: 7,
  'deep-learning': 4,
  generative: 4,
  applications: 2,
}

export default function HomePage() {
  return (
    <PageWrapper title="">
      {/* Hero */}
      <section className="py-16 md:py-24 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 text-xs font-semibold uppercase tracking-wide mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />
          Open-source · Interactive · Citable
        </div>
        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight mb-5">
          Understand Machine Learning{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-500 to-violet-500 animated-gradient">
            Through Interaction
          </span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-8 max-w-2xl mx-auto">
          Visualize and explore 20+ ML and AI algorithms — from supervised learning basics to generative AI and autonomous agents — with animated, interactive visualizations built for data scientists.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/fundamentals"
            className="px-5 py-2.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-semibold rounded-xl transition-colors focus-ring shadow-sm"
          >
            Start Learning
          </Link>
          <Link
            to="/generative"
            className="px-5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold rounded-xl transition-colors focus-ring"
          >
            Explore Generative AI →
          </Link>
        </div>
      </section>

      {/* Section cards */}
      <section className="pb-16">
        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-6 text-center">What you'll explore</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {SECTIONS.map(s => {
            const colors = COLOR_MAP[s.color]
            return (
              <Link
                key={s.id}
                to={s.path}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600 hover:shadow-md transition-all duration-200 focus-ring"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl mb-3 ${colors.bg}`}>
                  <span className={colors.text}>
                    {ICONS[s.id] || ICONS['fundamentals']}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
                    {s.label}
                  </h3>
                  <span className={`shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                    {SECTION_COUNTS[s.id]} topics
                  </span>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {s.description}
                </p>
                <div className="mt-3 flex flex-wrap gap-1">
                  {s.algorithms.slice(0, 3).map(a => (
                    <span key={a.id} className="text-xs text-slate-400 dark:text-slate-500">{a.label}{a !== s.algorithms.slice(0,3).at(-1) ? ' ·' : ''}</span>
                  ))}
                  {s.algorithms.length > 3 && (
                    <span className="text-xs text-slate-400 dark:text-slate-500">+{s.algorithms.length - 3} more</span>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </section>

      {/* Features strip */}
      <section className="py-10 border-t border-slate-200 dark:border-slate-800">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🎮', label: 'Interactive', desc: 'Drag, click, adjust sliders — see results instantly' },
            { icon: '📐', label: 'Mathematical', desc: 'Core equations rendered with LaTeX for every algorithm' },
            { icon: '📚', label: 'Cited Sources', desc: 'All content linked to original papers and textbooks' },
            { icon: '🌙', label: 'Dark Mode', desc: 'Easy on the eyes whether you code at noon or midnight' },
          ].map(f => (
            <div key={f.label} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{f.icon}</span>
              <span className="font-semibold text-sm text-slate-900 dark:text-slate-100">{f.label}</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">{f.desc}</span>
            </div>
          ))}
        </div>
      </section>
    </PageWrapper>
  )
}
