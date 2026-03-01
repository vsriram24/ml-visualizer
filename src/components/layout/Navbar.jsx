import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { useTheme } from '../../context/ThemeContext'
import { SECTIONS } from '../../data/algorithms-meta'

export function Navbar() {
  const { dark, toggle } = useTheme()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-lg px-1">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.8 1.8M5 14.5l-1.8 1.8m0 0a2.25 2.25 0 01-3.182 0M3.2 16.3a2.25 2.25 0 003.182 0m13.236 0a2.25 2.25 0 003.182 0m-3.182 0a2.25 2.25 0 01-3.182 0M9.75 20.25a2.25 2.25 0 001.5-2.122V5.25" />
              </svg>
            </div>
            <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">ML Visualizer</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {SECTIONS.map(s => (
              <NavLink
                key={s.id}
                to={s.path}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring
                   ${isActive
                     ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                     : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`
                }
              >
                {s.label}
              </NavLink>
            ))}
            <NavLink
              to="/references"
              className={({ isActive }) =>
                `px-3 py-1.5 text-sm font-medium rounded-lg transition-colors focus-ring
                 ${isActive
                   ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                   : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'}`
              }
            >
              References
            </NavLink>
          </div>

          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
              className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
            >
              {dark ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                </svg>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
              className="md:hidden p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus-ring"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileOpen
                  ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 flex flex-col gap-1">
          {SECTIONS.map(s => (
            <NavLink
              key={s.id}
              to={s.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors
                 ${isActive
                   ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                   : 'text-slate-600 dark:text-slate-300'}`
              }
            >
              {s.label}
            </NavLink>
          ))}
          <NavLink
            to="/references"
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              `px-3 py-2 text-sm font-medium rounded-lg transition-colors
               ${isActive
                 ? 'bg-brand-50 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400'
                 : 'text-slate-600 dark:text-slate-300'}`
            }
          >
            References
          </NavLink>
        </div>
      )}
    </nav>
  )
}
