import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Tabs } from '../../components/ui/Tabs'
import { useTheme } from '../../context/ThemeContext'

const TOKENS = ['The', 'cat', 'sat', 'on', 'mat']
const N = TOKENS.length

// Simulated attention weights for 4 heads
const HEADS = [
  // Head 0 — syntactic subject-verb
  [[1,.1,.05,.02,.02],[.3,.8,.1,.05,.05],[.1,.4,.7,.1,.08],[.05,.05,.3,.8,.1],[.02,.02,.1,.2,.9]],
  // Head 1 — semantic proximity
  [[.9,.5,.1,.05,.02],[.5,.9,.4,.1,.05],[.1,.4,.9,.4,.1],[.05,.1,.4,.9,.4],[.02,.05,.1,.4,.9]],
  // Head 2 — long-range dependency
  [[.8,.2,.3,.1,.5],[.2,.8,.2,.1,.3],[.3,.2,.8,.2,.1],[.1,.1,.2,.8,.2],[.5,.3,.1,.2,.9]],
  // Head 3 — positional
  [[1,.05,.02,.01,.01],[.1,.9,.1,.05,.02],[.05,.1,.9,.1,.05],[.02,.05,.1,.9,.1],[.01,.02,.05,.1,.95]],
]

const W = 480, H = 260, PAD = 60

// Each step highlights one query row in turn
export const ATTN_STEPS = N

export function AttentionViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const [head, setHead] = useState(0)
  const { dark } = useTheme()

  const activeRow = step % N

  useEffect(() => {
    const weights = HEADS[head]
    const labelFill = dark ? '#94a3b8' : '#475569'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const cellW = (W - 2 * PAD) / N
    const cellH = (H - 2 * PAD - 30) / N

    const colorScale = d3.scaleSequential(d3.interpolateBlues).domain([0, 1])

    // Column labels (keys) — theme-aware
    TOKENS.forEach((tok, j) => {
      svg.append('text').attr('x', PAD + j * cellW + cellW / 2).attr('y', PAD - 8)
        .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 600)
        .attr('fill', labelFill).text(tok)
    })

    // Row labels (queries) + heatmap
    TOKENS.forEach((tok, i) => {
      const isActive = i === activeRow
      const rowOpacity = isActive ? 1 : 0.45

      // Row label — highlight active query token
      svg.append('text').attr('x', PAD - 6).attr('y', PAD + i * cellH + cellH / 2 + 4)
        .attr('text-anchor', 'end').attr('font-size', 11)
        .attr('font-weight', isActive ? 700 : 600)
        .attr('fill', isActive ? '#6366f1' : labelFill)
        .text(tok)

      weights[i].forEach((w, j) => {
        svg.append('rect')
          .attr('x', PAD + j * cellW + 1).attr('y', PAD + i * cellH + 1)
          .attr('width', cellW - 2).attr('height', cellH - 2).attr('rx', 3)
          .attr('fill', colorScale(w)).attr('opacity', rowOpacity)

        // Value text — dark-mode aware contrast
        const valFill = w > 0.5
          ? (dark ? '#e2e8f0' : 'white')
          : (dark ? '#94a3b8' : '#334155')
        svg.append('text')
          .attr('x', PAD + j * cellW + cellW / 2).attr('y', PAD + i * cellH + cellH / 2 + 4)
          .attr('text-anchor', 'middle').attr('font-size', 10)
          .attr('fill', valFill).attr('opacity', rowOpacity)
          .text(w.toFixed(2))
      })

      // Highlight border on active row
      if (isActive) {
        svg.append('rect')
          .attr('x', PAD).attr('y', PAD + i * cellH)
          .attr('width', N * cellW).attr('height', cellH - 1).attr('rx', 3)
          .attr('fill', 'none').attr('stroke', '#6366f1').attr('stroke-width', 2)
      }
    })

    // Colorbar legend
    const barW = 120, barH = 10, barX = W - PAD - barW, barY = H - 20
    const lg = svg.append('defs').append('linearGradient').attr('id', 'attn-lg').attr('x1', '0%').attr('x2', '100%')
    lg.append('stop').attr('offset', '0%').attr('stop-color', colorScale(0))
    lg.append('stop').attr('offset', '100%').attr('stop-color', colorScale(1))
    svg.append('rect').attr('x', barX).attr('y', barY).attr('width', barW).attr('height', barH)
      .attr('rx', 3).attr('fill', 'url(#attn-lg)')
    svg.append('text').attr('x', barX - 4).attr('y', barY + 8).attr('font-size', 9).attr('text-anchor', 'end').attr('fill', '#94a3b8').text('0')
    svg.append('text').attr('x', barX + barW + 4).attr('y', barY + 8).attr('font-size', 9).attr('fill', '#94a3b8').text('1')
    svg.append('text').attr('x', barX + barW / 2).attr('y', barY - 3).attr('font-size', 9).attr('text-anchor', 'middle').attr('fill', '#94a3b8').text('Attention weight')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [head, step, resetKey, dark])

  const headTabs = [0, 1, 2, 3].map(i => ({ id: i, label: `Head ${i + 1}` }))

  return (
    <div>
      <div className="px-4 pt-3 pb-2">
        <Tabs tabs={headTabs} active={head} onChange={setHead} />
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="Transformer attention weight heatmap"
      />
    </div>
  )
}
