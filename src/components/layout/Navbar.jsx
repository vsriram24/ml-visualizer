import { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { SECTIONS } from '../../data/algorithms-meta'

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <nav className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur border-b border-slate-800">
      <div className="max-w-screen-xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 focus-ring rounded-lg px-1">
            <div className="w-7 h-7 bg-brand-500 rounded-lg flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15M14.25 3.104c.251.023.501.05.75.082M19.8 15l-1.8 1.8M5 14.5l-1.8 1.8m0 0a2.25 2.25 0 01-3.182 0M3.2 16.3a2.25 2.25 0 003.182 0m13.236 0a2.25 2.25 0 003.182 0m-3.182 0a2.25 2.25 0 01-3.182 0M9.75 20.25a2.25 2.25 0 001.5-2.122V5.25" />
              </svg>
            </div>
            <span className="font-semibold text-slate-100 text-sm">Manifold</span>
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
                     ? 'bg-brand-900/40 text-brand-400'
                     : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`
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
                   ? 'bg-brand-900/40 text-brand-400'
                   : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'}`
              }
            >
              References
            </NavLink>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:bg-slate-800 transition-colors focus-ring"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              {mobileOpen
                ? <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                : <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 flex flex-col gap-1">
          {SECTIONS.map(s => (
            <NavLink
              key={s.id}
              to={s.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `px-3 py-2 text-sm font-medium rounded-lg transition-colors
                 ${isActive
                   ? 'bg-brand-900/40 text-brand-400'
                   : 'text-slate-400'}`
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
                 ? 'bg-brand-900/40 text-brand-400'
                 : 'text-slate-400'}`
            }
          >
            References
          </NavLink>
        </div>
      )}
    </nav>
  )
}
