import { Link } from 'react-router-dom'
import { PageWrapper } from '../components/layout/PageWrapper'

export default function AboutPage() {
  return (
    <PageWrapper title="About">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-slate-100 mb-2">About</h1>
          <p className="text-slate-400 text-sm">The project, the methods, and the person behind it.</p>
        </div>

        {/* Why this exists */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-full inline-block" />
            Why This Exists
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Machine learning has an intuition problem. The equations are precise, the implementations are powerful, but for many practitioners the gap between reading a formula and genuinely understanding what an algorithm is <em>doing</em> stays stubbornly wide.
            </p>
            <p>
              Machine Learning Vista was built to close that gap — not by simplifying concepts into inaccuracy, but by making them visceral. Watching gradient descent converge in real time, dragging data points and seeing a regression line respond instantly, or observing an attention heatmap shift token-by-token: these experiences build intuition that a textbook derivation alone rarely achieves.
            </p>
            <p>
              The goal is a free, openly accessible resource for anyone — students, working data scientists, researchers — who wants a clearer mental model of the algorithms shaping modern AI. Every visualization includes the core equation, annotated variables, key conceptual ideas, a reference implementation, and citations to the original literature.
            </p>
          </div>
        </section>

        {/* How it was built */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-full inline-block" />
            How It Was Built
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              The site is built with <strong className="text-slate-100">React</strong> and <strong className="text-slate-100">Vite</strong>, with all visualizations authored in <strong className="text-slate-100">D3.js</strong>. Each algorithm page is code-split and lazy-loaded to keep the bundle lean. Math is rendered via <strong className="text-slate-100">KaTeX</strong> and the full citation registry links every claim to its source paper or textbook.
            </p>
            <p>
              The entire site — from initial scaffolding to every interactive visualization — was developed using <strong className="text-slate-100">Claude Code</strong>, Anthropic's agentic coding assistant. Claude Code handled component generation, D3 animation logic, routing, theming, and iterative refinement across hundreds of files, making a project of this scope achievable as a solo build.
            </p>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {['React 18', 'Vite', 'D3.js v7', 'Tailwind CSS', 'KaTeX', 'Claude Code'].map(tag => (
              <span key={tag} className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700">
                {tag}
              </span>
            ))}
          </div>
        </section>

        {/* Divider */}
        <div className="border-t border-slate-800 mb-10" />

        {/* About Vivek */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-full inline-block" />
            About the Author
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              Hi — I'm <strong className="text-slate-100">Vivek Sriram</strong>, a Senior Health AI Scientist based in Seattle, WA. I work at the intersection of generative AI, agentic systems, and multimodal biomedical data to build reliable, interpretable, and production-grade AI systems for real-world healthcare impact.
            </p>
          </div>
        </section>

        {/* Find me online */}
        <section className="mb-10">
          <h2 className="text-base font-semibold text-slate-100 mb-3 flex items-center gap-2">
            <span className="w-1 h-4 bg-brand-500 rounded-full inline-block" />
            Find Me Online
          </h2>
          <div className="space-y-3 text-sm text-slate-300 leading-relaxed">
            <p>
              You can learn more about my work and other projects at{' '}
              <a
                href="https://viveksriram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-brand-400 hover:text-brand-300 transition-colors underline underline-offset-2"
              >
                viveksriram.com
              </a>
              .
            </p>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href="https://viveksriram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-500 hover:bg-brand-600 text-white text-sm font-medium transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253M3 12c0 .778.099 1.533.284 2.253" />
              </svg>
              viveksriram.com
            </a>
            <a
              href="https://github.com/vsriram24/ml-visualizer"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-slate-100 text-sm font-medium transition-colors border border-slate-700"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              Source on GitHub
            </a>
          </div>
        </section>

        {/* Footer nav hint */}
        <div className="pt-6 border-t border-slate-800 text-xs text-slate-500">
          Want to explore the algorithms?{' '}
          <Link to="/fundamentals" className="text-brand-400 hover:text-brand-300 transition-colors">
            Start with ML Fundamentals →
          </Link>
        </div>

      </div>
    </PageWrapper>
  )
}
