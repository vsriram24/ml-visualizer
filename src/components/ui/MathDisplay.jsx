import katex from 'katex'
import 'katex/dist/katex.min.css'

export function MathDisplay({ tex, block = false }) {
  let html = ''
  try {
    html = katex.renderToString(tex, {
      throwOnError: false,
      displayMode: block,
    })
  } catch {
    html = `<span class="text-red-500 text-xs">[LaTeX error]</span>`
  }

  if (block) {
    return (
      <div
        className="overflow-x-auto py-2 text-center"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    )
  }
  return <span dangerouslySetInnerHTML={{ __html: html }} />
}
