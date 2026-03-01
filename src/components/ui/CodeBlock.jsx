export function CodeBlock({ code, language = 'python' }) {
  return (
    <div className="relative group">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 dark:bg-slate-900 rounded-t-lg">
        <span className="text-xs text-slate-400 font-mono">{language}</span>
        <button
          onClick={() => navigator.clipboard.writeText(code)}
          className="text-xs text-slate-400 hover:text-slate-200 transition-colors focus-ring rounded px-2 py-0.5"
          aria-label="Copy code"
        >
          Copy
        </button>
      </div>
      <pre className="bg-slate-900 dark:bg-black text-slate-100 text-sm p-4 rounded-b-lg overflow-x-auto leading-relaxed">
        <code className="font-mono">{code}</code>
      </pre>
    </div>
  )
}
