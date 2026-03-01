import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

export const SUPERVISED_STEPS = 42

const W = 480, H = 300, PAD = 32

const rng = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }
const r = rng(42)

const CLASS_A = Array.from({ length: 18 }, () => ({ x: 0.08 + r() * 0.38, y: 0.42 + r() * 0.50, cls: 0 }))
const CLASS_B = Array.from({ length: 18 }, () => ({ x: 0.42 + r() * 0.50, y: 0.06 + r() * 0.42, cls: 1 }))
const POINTS = [...CLASS_A, ...CLASS_B]

const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
const ySc = d3.scaleLinear([0, 1], [H - PAD, PAD])
const COLOR = ['#06b6d4', '#f43f5e']

export function SupervisedViz({ step = 0 }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const textSec = dark ? '#94a3b8' : '#64748b'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H - PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    const leg = svg.append('g').attr('transform', `translate(${W - 112}, 12)`)
    ;[['#06b6d4', 'Class A', false], ['#f43f5e', 'Class B', true]].forEach(([c, label, tri], i) => {
      const row = leg.append('g').attr('transform', `translate(0, ${i * 18})`)
      if (!tri) row.append('circle').attr('r', 5).attr('cx', 6).attr('cy', 0).attr('fill', c).attr('opacity', 0.85)
      else row.append('path').attr('d', d3.symbol().type(d3.symbolTriangle).size(50)()).attr('transform', 'translate(6,0)').attr('fill', c).attr('opacity', 0.85)
      row.append('text').attr('x', 15).attr('y', 4).attr('font-size', 11).attr('fill', textSec).text(label)
    })

    POINTS.slice(0, Math.min(step, POINTS.length)).forEach(p => {
      if (p.cls === 0) {
        svg.append('circle').attr('cx', xSc(p.x)).attr('cy', ySc(p.y)).attr('r', 6)
          .attr('fill', COLOR[p.cls]).attr('opacity', 0.85)
      } else {
        svg.append('path').attr('d', d3.symbol().type(d3.symbolTriangle).size(80)())
          .attr('transform', `translate(${xSc(p.x)}, ${ySc(p.y)})`).attr('fill', COLOR[p.cls]).attr('opacity', 0.85)
      }
    })

    if (step >= 36) {
      const t = Math.min((step - 36) / 3, 1)
      svg.append('line')
        .attr('x1', xSc(0)).attr('y1', ySc(0.43))
        .attr('x2', xSc(t)).attr('y2', ySc(0.43 + t * 0.10))
        .attr('stroke', '#8b5cf6').attr('stroke-width', 2.5).attr('stroke-dasharray', '6,3').attr('opacity', 0.9)
      if (t > 0.6) {
        svg.append('text').attr('x', xSc(0.5)).attr('y', ySc(0.49)).attr('text-anchor', 'middle')
          .attr('font-size', 10).attr('fill', '#8b5cf6').text('Decision boundary')
      }
    }

    if (step >= 40) {
      svg.append('circle').attr('cx', xSc(0.55)).attr('cy', ySc(0.28)).attr('r', 9)
        .attr('fill', COLOR[1]).attr('stroke', '#f59e0b').attr('stroke-width', 2.5).attr('opacity', 0.95)
      svg.append('text').attr('x', xSc(0.57)).attr('y', ySc(0.28) - 12)
        .attr('font-size', 10).attr('fill', '#f59e0b').attr('font-weight', 600).text('→ Class B')
    }
  }, [step, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Supervised learning visualization" />
  )
}
