import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const TOKENS = ['The', 'cat', 'sat', 'on', 'mat']
const W = 480, H = 260

export const RNN_STEPS = TOKENS.length

export function RNNUnrollViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const titleFill = dark ? '#f1f5f9' : '#1e293b'
    const cellFill  = dark ? '#2e1065' : '#ede9fe'
    const tokenFill = dark ? '#e2e8f0' : '#334155'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const n = TOKENS.length
    const cellW = (W - 40) / n
    const cellH = 70
    const baseY = 120

    const defs = svg.append('defs')
    ;[['arrow-gray', '#94a3b8'], ['arrow-violet', '#8b5cf6']].forEach(([id, color]) => {
      defs.append('marker').attr('id', id).attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('refX', 3).attr('refY', 3).attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L6,3 L0,6 Z').attr('fill', color)
    })

    svg.append('text').attr('x', W / 2).attr('y', 20).attr('text-anchor', 'middle')
      .attr('font-size', 12).attr('font-weight', 600).attr('fill', titleFill)
      .text('RNN Unrolled — Sequence Processing')

    const visibleCount = Math.min(step + 1, n)

    for (let i = 0; i < visibleCount; i++) {
      const x = 20 + i * cellW + cellW / 2
      const y = baseY

      const g = svg.append('g')

      g.append('rect').attr('x', x - 30).attr('y', y - cellH / 2).attr('width', 60).attr('height', cellH)
        .attr('rx', 8).attr('fill', cellFill).attr('stroke', '#8b5cf6').attr('stroke-width', 2)

      g.append('text').attr('x', x).attr('y', y + 4).attr('text-anchor', 'middle')
        .attr('font-size', 12).attr('font-weight', 700).attr('fill', '#a78bfa').text(`h${i}`)

      g.append('text').attr('x', x).attr('y', y + cellH / 2 + 20).attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('fill', tokenFill).text(TOKENS[i])

      g.append('line').attr('x1', x).attr('y1', y + cellH / 2 + 12)
        .attr('x2', x).attr('y2', y + cellH / 2 + 1)
        .attr('stroke', '#94a3b8').attr('stroke-width', 1.5)
        .attr('marker-end', 'url(#arrow-gray)')

      if (i === n - 1) {
        g.append('text').attr('x', x).attr('y', y - cellH / 2 - 16).attr('text-anchor', 'middle')
          .attr('font-size', 10).attr('fill', '#06b6d4').text('ŷ (prediction)')
        g.append('line').attr('x1', x).attr('y1', y - cellH / 2 - 8)
          .attr('x2', x).attr('y2', y - cellH / 2 - 1)
          .attr('stroke', '#06b6d4').attr('stroke-width', 1.5)
      }

      if (i < n - 1 && i < visibleCount - 1) {
        const nx = 20 + (i + 1) * cellW + cellW / 2
        svg.append('line')
          .attr('x1', x + 30).attr('y1', y).attr('x2', nx - 30).attr('y2', y)
          .attr('stroke', '#8b5cf6').attr('stroke-width', 2)
          .attr('marker-end', 'url(#arrow-violet)')
        svg.append('text').attr('x', (x + nx) / 2).attr('y', y - 8).attr('text-anchor', 'middle')
          .attr('font-size', 9).attr('fill', '#8b5cf6').text(`h${i}→`)
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="RNN unrolled across time steps"
    />
  )
}
