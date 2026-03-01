const SPEEDS = [0.5, 1, 2]

export function VizControls({
  playing, onToggle, onReset, onStep,
  speed, onSpeed,
  step = 0, totalSteps = 0,
}) {
  const hasSteps = totalSteps > 0
  const pct = hasSteps && totalSteps > 1 ? (step / (totalSteps - 1)) * 100 : 0
  const atEnd = hasSteps && step >= totalSteps - 1

  return (
    <div className="border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
      {/* Progress bar — only shown for step-based animations */}
      {hasSteps && (
        <div className="px-4 pt-2.5 pb-1">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-mono text-slate-500 dark:text-slate-300 tabular-nums">
              Step {step + 1} / {totalSteps}
            </span>
            {atEnd && !playing && (
              <span className="text-[10px] text-emerald-500 font-medium">Complete ✓</span>
            )}
          </div>
          <div
            className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden"
            role="progressbar"
            aria-valuenow={step + 1}
            aria-valuemin={1}
            aria-valuemax={totalSteps}
            aria-label="Animation progress"
          >
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Button row */}
      <div className="flex flex-wrap items-center gap-2 px-4 py-2">
        {/* Play / Pause */}
        <button
          onClick={onToggle}
          aria-pressed={playing}
          aria-label={playing ? 'Pause animation' : atEnd ? 'Replay animation' : 'Play animation'}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium rounded-lg transition-colors focus-ring"
        >
          {playing ? (
            /* Pause icon */
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <rect x="4" y="3" width="4" height="14" rx="1"/>
              <rect x="12" y="3" width="4" height="14" rx="1"/>
            </svg>
          ) : atEnd ? (
            /* Replay icon */
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
            </svg>
          ) : (
            /* Play icon */
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M6.3 2.841A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z"/>
            </svg>
          )}
          {playing ? 'Pause' : atEnd ? 'Replay' : 'Play'}
        </button>

        {/* Step button — only for step-based animations */}
        {onStep && (
          <button
            onClick={onStep}
            aria-label="Advance one step"
            disabled={atEnd}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600
                       hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200
                       text-sm font-medium rounded-lg transition-colors focus-ring
                       disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M3 4.75a1 1 0 011.5-.87l10 5.25a1 1 0 010 1.74l-10 5.25A1 1 0 013 15.25V4.75zM15 4a1 1 0 011 1v10a1 1 0 11-2 0V5a1 1 0 011-1z"/>
            </svg>
            Step
          </button>
        )}

        {/* Reset */}
        <button
          onClick={onReset}
          aria-label="Reset animation"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-sm font-medium rounded-lg transition-colors focus-ring"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Reset
        </button>

        {/* Speed buttons */}
        <div className="flex gap-1 ml-auto" role="group" aria-label="Playback speed">
          {SPEEDS.map(s => (
            <button
              key={s}
              onClick={() => onSpeed(s)}
              aria-label={`Speed ${s}x`}
              aria-pressed={speed === s}
              className={`px-2.5 py-1 text-xs font-mono rounded-md transition-colors focus-ring
                ${speed === s
                  ? 'bg-brand-500 text-white'
                  : 'bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-600'}`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
