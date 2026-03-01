import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 258
const LABEL_W = 122
const CELL_W  = 70
const HEADER_H = 36
const ROW_H    = 44
// Table bottom = HEADER_H + 4*ROW_H = 36 + 176 = 212
// Separator at y=216, legend centers at y=238 — clearly below table

const ROWS = [
  { name: 'ReAct',              cols: ['partial', 'yes', 'no',  'no',  'Factual lookup'] },
  { name: 'Plan-and-Execute',   cols: ['yes',     'yes', 'no',  'yes', 'Complex tasks']  },
  { name: 'Reflexion',          cols: ['no',      'no',  'yes', 'no',  'Quality output'] },
  { name: 'Tree of Thoughts',   cols: ['yes',     'no',  'yes', 'yes', 'Hard reasoning'] },
]
const COLS = ['Planning', 'Tool Use', 'Self-Correct', 'Parallel', 'Best For']
const TABLE_BOTTOM = HEADER_H + ROWS.length * ROW_H  // 212

export function AgentComparisonViz({ resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const hdrFill    = dark ? '#f1f5f9' : '#1e293b'
    const subFill    = dark ? '#94a3b8' : '#64748b'
    const bgFill     = dark ? '#1e293b' : '#f8fafc'
    const gridLine   = dark ? '#334155' : '#e2e8f0'
    const rowAlt     = dark ? '#0f172a' : '#ffffff'
    const indigo     = '#6366f1'
    const grayCircle = dark ? '#475569' : '#cbd5e1'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Table background (table area only)
    svg.append('rect').attr('x', 0).attr('y', 0).attr('width', W).attr('height', TABLE_BOTTOM)
      .attr('fill', bgFill)

    // Column headers
    COLS.forEach((col, j) => {
      const cx = LABEL_W + j * CELL_W + CELL_W / 2
      svg.append('text').attr('x', cx).attr('y', HEADER_H - 8)
        .attr('text-anchor', 'middle').attr('font-size', 8.5).attr('font-weight', 700)
        .attr('fill', hdrFill).text(col)
    })

    // Rows
    ROWS.forEach((row, i) => {
      const ry = HEADER_H + i * ROW_H

      // Alternating row background
      svg.append('rect').attr('x', 0).attr('y', ry).attr('width', W).attr('height', ROW_H)
        .attr('fill', i % 2 === 0 ? bgFill : rowAlt)

      // Row label
      svg.append('text').attr('x', 10).attr('y', ry + ROW_H / 2 + 4)
        .attr('font-size', 9.5).attr('font-weight', 600)
        .attr('fill', hdrFill).text(row.name)

      // Cells
      row.cols.forEach((val, j) => {
        const cx = LABEL_W + j * CELL_W + CELL_W / 2
        const cy = ry + ROW_H / 2
        const isLastCol = j === COLS.length - 1

        if (isLastCol) {
          svg.append('text').attr('x', cx).attr('y', cy + 4)
            .attr('text-anchor', 'middle').attr('font-size', 8.5)
            .attr('fill', subFill).text(val)
        } else if (val === 'yes') {
          svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 9).attr('fill', indigo)
          svg.append('text').attr('x', cx).attr('y', cy + 4)
            .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', 'white').text('●')
        } else if (val === 'partial') {
          svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 9).attr('fill', grayCircle)
          const clipId = `half-clip-${i}-${j}`
          svg.append('defs').append('clipPath').attr('id', clipId)
            .append('rect').attr('x', cx - 9).attr('y', cy - 9).attr('width', 9).attr('height', 18)
          svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 9)
            .attr('fill', indigo).attr('clip-path', `url(#${clipId})`)
        } else {
          svg.append('circle').attr('cx', cx).attr('cy', cy).attr('r', 9)
            .attr('fill', 'none').attr('stroke', grayCircle).attr('stroke-width', 2)
        }
      })
    })

    // Vertical grid lines — stop at table bottom
    for (let j = 0; j <= COLS.length; j++) {
      const lx = j === 0 ? LABEL_W : LABEL_W + j * CELL_W
      svg.append('line').attr('x1', lx).attr('y1', 0).attr('x2', lx).attr('y2', TABLE_BOTTOM)
        .attr('stroke', gridLine).attr('stroke-width', 0.5)
    }
    // Horizontal grid lines between rows
    for (let i = 0; i <= ROWS.length; i++) {
      const ly = HEADER_H + i * ROW_H
      svg.append('line').attr('x1', 0).attr('y1', ly).attr('x2', W).attr('y2', ly)
        .attr('stroke', gridLine).attr('stroke-width', i === 0 ? 1 : 0.5)
    }

    // Separator between table and legend
    svg.append('line').attr('x1', 4).attr('y1', TABLE_BOTTOM + 4).attr('x2', W - 4).attr('y2', TABLE_BOTTOM + 4)
      .attr('stroke', gridLine).attr('stroke-width', 1)

    // Legend — clearly below separator
    const legY = TABLE_BOTTOM + 26   // y=238: 22px below table bottom
    const items = [
      { symbol: 'filled', label: '● Yes' },
      { symbol: 'half',   label: '◑ Partial' },
      { symbol: 'empty',  label: '○ No' },
    ]
    items.forEach((item, k) => {
      const lx = 10 + k * 90
      if (item.symbol === 'filled') {
        svg.append('circle').attr('cx', lx + 5).attr('cy', legY).attr('r', 5).attr('fill', indigo)
      } else if (item.symbol === 'half') {
        svg.append('circle').attr('cx', lx + 5).attr('cy', legY).attr('r', 5).attr('fill', grayCircle)
        const clipId = `leg-half-${k}`
        svg.append('defs').append('clipPath').attr('id', clipId)
          .append('rect').attr('x', lx).attr('y', legY - 5).attr('width', 5).attr('height', 10)
        svg.append('circle').attr('cx', lx + 5).attr('cy', legY).attr('r', 5)
          .attr('fill', indigo).attr('clip-path', `url(#${clipId})`)
      } else {
        svg.append('circle').attr('cx', lx + 5).attr('cy', legY).attr('r', 5)
          .attr('fill', 'none').attr('stroke', grayCircle).attr('stroke-width', 1.5)
      }
      svg.append('text').attr('x', lx + 14).attr('y', legY + 4)
        .attr('font-size', 8.5).attr('fill', subFill).text(item.label)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Agent framework comparison matrix" />
  )
}
