import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 300, PAD = 40

const POINTS = [
  { x: 0.6, y: 0.7, cls: 1 }, { x: 0.72, y: 0.62, cls: 1 }, { x: 0.65, y: 0.55, cls: 1 },
  { x: 0.8, y: 0.8, cls: 1 }, { x: 0.55, y: 0.75, cls: 1 }, { x: 0.75, y: 0.45, cls: 1 },
  { x: 0.85, y: 0.65, cls: 1 }, { x: 0.58, y: 0.85, cls: 1 },
  { x: 0.2, y: 0.3, cls: -1 }, { x: 0.3, y: 0.2, cls: -1 }, { x: 0.15, y: 0.45, cls: -1 },
  { x: 0.35, y: 0.35, cls: -1 }, { x: 0.25, y: 0.15, cls: -1 }, { x: 0.1, y: 0.25, cls: -1 },
  { x: 0.4, y: 0.25, cls: -1 }, { x: 0.28, y: 0.48, cls: -1 },
]

const SUPPORT_VECTORS = [
  { x: 0.55, y: 0.55, cls: 1 },
  { x: 0.75, y: 0.45, cls: 1 },
  { x: 0.35, y: 0.35, cls: -1 },
  { x: 0.4, y: 0.25, cls: -1 },
]

// Step 0: points only. Step 1: + decision boundary. Step 2: + margin lines + labels.
export const SVM_STEPS = 3

const w0 = 0.82, b0 = 0.1
const marginOffset = 0.14

export function SVMViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const textSec = dark ? '#94a3b8' : '#64748b'

    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    // Top at 64 gives more breathing room above the legend items
    const ySc = d3.scaleLinear([0, 1], [H - PAD, 64])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H-PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    if (step >= 1) {
      svg.append('line')
        .attr('x1', xSc(0)).attr('y1', ySc(b0))
        .attr('x2', xSc(1)).attr('y2', ySc(w0 + b0))
        .attr('stroke', '#6366f1').attr('stroke-width', 2.5)
    }

    if (step >= 2) {
      svg.append('line')
        .attr('x1', xSc(0)).attr('y1', ySc(b0 + marginOffset))
        .attr('x2', xSc(1)).attr('y2', ySc(w0 + b0 + marginOffset))
        .attr('stroke', '#06b6d4').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.8)

      svg.append('line')
        .attr('x1', xSc(0)).attr('y1', ySc(b0 - marginOffset))
        .attr('x2', xSc(1)).attr('y2', ySc(w0 + b0 - marginOffset))
        .attr('stroke', '#f43f5e').attr('stroke-width', 1.5).attr('stroke-dasharray', '5,3').attr('opacity', 0.8)

      svg.append('text')
        .attr('x', xSc(0.5)).attr('y', ySc(w0 * 0.5 + b0) - 8)
        .attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', '#6366f1').attr('font-weight', 600)
        .text('Decision boundary (maximum margin)')
    }

    POINTS.forEach(p => {
      const isSV = SUPPORT_VECTORS.some(sv => sv.x === p.x && sv.y === p.y && sv.cls === p.cls)
      svg.append('circle')
        .attr('cx', xSc(p.x)).attr('cy', ySc(p.y)).attr('r', isSV && step >= 2 ? 9 : 6)
        .attr('fill', p.cls === 1 ? '#06b6d4' : '#f43f5e')
        .attr('stroke', isSV && step >= 2 ? '#f59e0b' : 'white')
        .attr('stroke-width', isSV && step >= 2 ? 3 : 1.5)
        .attr('opacity', 0.9)
    })

    const leg = svg.append('g').attr('transform', 'translate(12, 12)')
    const items = step >= 2
      ? [['#06b6d4', 'Class +1'], ['#f43f5e', 'Class −1'], ['#f59e0b', 'Support vector']]
      : [['#06b6d4', 'Class +1'], ['#f43f5e', 'Class −1']]
    leg.append('rect').attr('x', -4).attr('y', -10).attr('width', 100).attr('height', items.length * 18 + 14).attr('rx', 4)
      .attr('fill', dark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)')
      .attr('stroke', dark ? '#334155' : '#e2e8f0').attr('stroke-width', 1)
    items.forEach(([c, label], i) => {
      const row = leg.append('g').attr('transform', `translate(0, ${i * 18})`)
      row.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 0)
        .attr('fill', i === 2 ? 'transparent' : c).attr('stroke', c).attr('stroke-width', 2)
      row.append('text').attr('x', 14).attr('y', 4).attr('font-size', 10).attr('fill', textSec).text(label)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="Support Vector Machine margin visualization"
    />
  )
}
