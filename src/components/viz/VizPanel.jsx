import { useState, useEffect, useRef } from 'react'
import { VizControls } from './VizControls'
import { Badge } from '../ui/Badge'
import { CitationBlock } from '../ui/CitationBlock'

/**
 * VizPanel — owns the animation clock so visualizations don't race each other.
 *
 * Props:
 *   totalSteps   number  — how many discrete steps (0 = no step control)
 *   stepInterval number  — ms between auto-steps at 1x speed (default 700)
 *   loops        bool    — wrap back to step 0 when done (default false)
 *   showControls bool    — show the control bar (default true)
 *
 * Render prop receives: { step, playing, speed, resetKey }
 *   step    — current step index (0-based)
 *   playing — whether auto-play is running
 *   speed   — current speed multiplier
 *   resetKey — incremented on Reset; trigger effects with this as dep
 */
export function VizPanel({
  title,
  badge,
  badgeLabel,
  children,
  caption,
  citations = [],
  showControls = true,
  totalSteps = 0,
  stepInterval = 700,
  loops = false,
  className = '',
}) {
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)
  const [resetKey, setResetKey] = useState(0)
  const [step, setStep] = useState(0)
  const intervalRef = useRef(null)

  // Auto-advance step when playing
  useEffect(() => {
    if (!playing || totalSteps === 0) return

    const ms = stepInterval / speed
    intervalRef.current = setInterval(() => {
      setStep(s => {
        if (s >= totalSteps - 1) {
          if (loops) return 0
          setPlaying(false)
          return s
        }
        return s + 1
      })
    }, ms)

    return () => clearInterval(intervalRef.current)
  }, [playing, speed, totalSteps, stepInterval, loops])

  function handleReset() {
    clearInterval(intervalRef.current)
    setPlaying(false)
    setStep(0)
    setResetKey(k => k + 1)
  }

  function handleStep() {
    setPlaying(false)
    setStep(s => (s >= totalSteps - 1 ? (loops ? 0 : s) : s + 1))
  }

  return (
    <div className={`viz-container ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        {badge && <Badge variant={badge}>{badgeLabel || badge}</Badge>}
      </div>

      {/* Visualization area */}
      <div className="relative">
        {children({ step, playing, speed, resetKey })}
      </div>

      {/* Controls */}
      {showControls && (
        <VizControls
          playing={playing}
          onToggle={() => setPlaying(p => !p)}
          onReset={handleReset}
          onStep={totalSteps > 0 ? handleStep : undefined}
          speed={speed}
          onSpeed={setSpeed}
          step={step}
          totalSteps={totalSteps}
        />
      )}

      {/* Caption */}
      {caption && (
        <div className="px-4 py-3 border-t border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{caption}</p>
          {citations.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              <span className="text-xs text-slate-400 dark:text-slate-300">Sources:</span>
              {citations.map(k => <CitationBlock key={k} citeKey={k} />)}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
