import { NavLink } from 'react-router-dom'
import { COLOR_MAP } from '../../data/algorithms-meta'

export function Sidebar({ section }) {
  const colors = COLOR_MAP[section.color]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-56 shrink-0">
        <div className="sticky top-20">
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wide mb-3 ${colors.bg} ${colors.text}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
            {section.label}
          </div>
          <nav className="flex flex-col gap-0.5" aria-label="Algorithm navigation">
            {section.algorithms.map(algo => (
              <NavLink
                key={algo.id}
                to={algo.path}
                className={({ isActive }) =>
                  `px-3 py-2 text-sm rounded-lg transition-colors focus-ring block
                   ${isActive
                     ? `font-medium ${colors.text} ${colors.bg}`
                     : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }
              >
                {algo.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>

      {/* Mobile horizontal scroll */}
      <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-6 -mx-4 px-4">
        {section.algorithms.map(algo => (
          <NavLink
            key={algo.id}
            to={algo.path}
            className={({ isActive }) =>
              `shrink-0 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors whitespace-nowrap
               ${isActive
                 ? `${colors.bg} ${colors.text} ${colors.border} border`
                 : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`
            }
          >
            {algo.label}
          </NavLink>
        ))}
      </div>
    </>
  )
}
