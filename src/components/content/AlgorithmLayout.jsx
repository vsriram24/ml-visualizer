import { Badge } from '../ui/Badge'
import { MathDisplay } from '../ui/MathDisplay'
import { CitationBlock } from '../ui/CitationBlock'
import { CodeBlock } from '../ui/CodeBlock'

export function AlgorithmLayout({
  name,
  tagline,
  type,          // 'supervised' | 'unsupervised' | etc.
  complexity,
  equation,
  equationLabel,
  equationVars,  // { sym: string (LaTeX), desc: string }[]
  description,
  keyIdeas,      // string[]
  children,      // visualization(s)
  code,
  codeLanguage,
  citations = [],
}) {
  return (
    <article className="animate-fade-in">
      {/* Header */}
      <header className="mb-8">
        <div className="flex flex-wrap items-start gap-3 mb-3">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{name}</h1>
          <div className="flex flex-wrap gap-2 mt-1">
            {type && <Badge variant={type}>{type}</Badge>}
            {complexity && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                {complexity}
              </span>
            )}
          </div>
        </div>
        <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed">{tagline}</p>
      </header>

      {/* Core equation */}
      {equation && (
        <div className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-xl">
          {equationLabel && (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300 mb-2">{equationLabel}</p>
          )}
          <MathDisplay tex={equation} block />
          {equationVars?.length > 0 && (
            <dl className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
              {equationVars.map(({ sym, desc }, i) => (
                <>
                  <dt key={`sym-${i}`} className="text-right leading-snug py-0.5">
                    <MathDisplay tex={sym} />
                  </dt>
                  <dd key={`desc-${i}`} className="text-xs text-slate-600 dark:text-slate-400 leading-snug py-0.5">{desc}</dd>
                </>
              ))}
            </dl>
          )}
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mb-8 prose prose-slate dark:prose-invert max-w-none">
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{description}</p>
        </div>
      )}

      {/* Key ideas */}
      {keyIdeas?.length > 0 && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Key Ideas</h2>
          <ul className="space-y-2">
            {keyIdeas.map((idea, i) => (
              <li key={i} className="flex gap-3 text-sm text-slate-700 dark:text-slate-300">
                <span className="mt-0.5 w-5 h-5 shrink-0 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                {idea}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Visualization area */}
      {children && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Interactive Visualization</h2>
          {children}
        </div>
      )}

      {/* Code */}
      {code && (
        <div className="mb-8">
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-3">Implementation</h2>
          <CodeBlock code={code} language={codeLanguage || 'python'} />
        </div>
      )}

      {/* Citations */}
      {citations.length > 0 && (
        <div className="pt-6 border-t border-slate-200 dark:border-slate-700">
          <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300 mb-2">References</h2>
          <div className="flex flex-wrap gap-2">
            {citations.map(k => <CitationBlock key={k} citeKey={k} />)}
          </div>
        </div>
      )}
    </article>
  )
}
