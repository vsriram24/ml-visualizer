import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 320
const QUERY = '"What causes climate change?"'

const CHUNKS = [
  { x: -0.8, y: 0.6, label: 'Climate science overview', relevant: true },
  { x: -0.6, y: 0.8, label: 'CO₂ emissions data', relevant: true },
  { x: -0.5, y: 0.4, label: 'Greenhouse gas effects', relevant: true },
  { x: 0.5, y: -0.7, label: 'Ocean current patterns', relevant: false },
  { x: 0.8, y: 0.2, label: 'Renewable energy tech', relevant: false },
  { x: 0.3, y: 0.9, label: 'Arctic ice measurements', relevant: false },
  { x: -0.2, y: -0.8, label: 'Historical weather data', relevant: false },
  { x: 0.7, y: -0.4, label: 'Solar panel efficiency', relevant: false },
]

const QUERY_PT = { x: -0.65, y: 0.65 }

// Steps 0-4: query embedded → search radius → retrieval lines → chunks highlighted → answer
export const RAG_STEPS = 5

export function RAGViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const [k, setK] = useState(3)
  const { dark } = useTheme()

  const phase = Math.min(step, 4)

  useEffect(() => {
    const xSc = d3.scaleLinear([-1.2, 1.2], [50, W - 50])
    const ySc = d3.scaleLinear([-1.2, 1.2], [H - 80, 50])

    const stepInactiveBg     = dark ? '#1e293b' : '#f1f5f9'
    const stepInactiveStroke = dark ? '#334155' : '#e2e8f0'
    const stepActiveBg       = dark ? '#1e3a5f' : '#dbeafe'
    const stepActiveStroke   = '#3b82f6'
    const stepActiveFill     = dark ? '#93c5fd' : '#1d4ed8'
    const answerBg           = dark ? '#052e16' : '#f0fdf4'
    const answerText         = dark ? '#34d399' : '#065f46'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${ySc(0)})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${xSc(0)},0)`).call(d3.axisLeft(ySc).ticks(5))
    svg.append('text').attr('x', W / 2).attr('y', 14).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#94a3b8').text('Embedding Space')

    const withDist = CHUNKS.map(c => ({
      ...c, d: Math.sqrt((c.x - QUERY_PT.x) ** 2 + (c.y - QUERY_PT.y) ** 2),
    })).sort((a, b) => a.d - b.d)
    const topK = withDist.slice(0, k)

    // Phase 1+: search radius circle
    if (phase >= 1) {
      const radius = withDist[k - 1].d
      svg.append('circle')
        .attr('cx', xSc(QUERY_PT.x)).attr('cy', ySc(QUERY_PT.y))
        .attr('r', xSc(QUERY_PT.x + radius) - xSc(QUERY_PT.x))
        .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '5,3').attr('opacity', 0.7)
    }

    // Phase 2+: lines to top-k chunks
    if (phase >= 2) {
      topK.forEach(c => {
        svg.append('line')
          .attr('x1', xSc(QUERY_PT.x)).attr('y1', ySc(QUERY_PT.y))
          .attr('x2', xSc(c.x)).attr('y2', ySc(c.y))
          .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('opacity', 0.6)
      })
    }

    // Document chunks
    CHUNKS.forEach(c => {
      const isSelected = topK.some(t => t.label === c.label)
      svg.append('rect')
        .attr('x', xSc(c.x) - 5).attr('y', ySc(c.y) - 5).attr('width', 10).attr('height', 10).attr('rx', 2)
        .attr('fill', isSelected && phase >= 3 ? '#f59e0b' : '#6366f1')
        .attr('stroke', isSelected && phase >= 3 ? '#d97706' : '#4338ca').attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
      if (isSelected && phase >= 3) {
        svg.append('text').attr('x', xSc(c.x) + 8).attr('y', ySc(c.y) + 4)
          .attr('font-size', 9).attr('fill', '#d97706').text(c.label)
      }
    })

    // Query point (always visible once phase >= 0)
    svg.append('circle')
      .attr('cx', xSc(QUERY_PT.x)).attr('cy', ySc(QUERY_PT.y)).attr('r', 10)
      .attr('fill', '#10b981').attr('stroke', 'white').attr('stroke-width', 2)
    svg.append('text').attr('x', xSc(QUERY_PT.x)).attr('y', ySc(QUERY_PT.y) - 14)
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', '#10b981').attr('font-weight', 600).text('Query')

    // Pipeline steps indicator
    const steps = [
      { label: '1. Embed query', active: phase >= 0 },
      { label: '2. Vector search', active: phase >= 1 },
      { label: `3. Retrieve top-${k}`, active: phase >= 2 },
      { label: '4. Augment & gen', active: phase >= 4 },
    ]

    const stepY = H - 68
    steps.forEach((s, i) => {
      const sx = 16 + i * (W / 4)
      svg.append('rect').attr('x', sx).attr('y', stepY).attr('width', W / 4 - 8).attr('height', 24).attr('rx', 4)
        .attr('fill', s.active ? stepActiveBg : stepInactiveBg)
        .attr('stroke', s.active ? stepActiveStroke : stepInactiveStroke).attr('stroke-width', 1)
      svg.append('text').attr('x', sx + (W / 4 - 8) / 2).attr('y', stepY + 15).attr('text-anchor', 'middle')
        .attr('font-size', 9).attr('fill', s.active ? stepActiveFill : '#94a3b8').attr('font-weight', s.active ? 600 : 400)
        .text(s.label)
    })

    // Phase 4+: answer box
    if (phase >= 4) {
      svg.append('rect').attr('x', 12).attr('y', H - 38).attr('width', W - 24).attr('height', 28).attr('rx', 6)
        .attr('fill', answerBg).attr('stroke', '#10b981').attr('stroke-width', 1.5)
      svg.append('text').attr('x', W / 2).attr('y', H - 20).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', answerText)
        .text(`LLM generates answer using ${k} retrieved chunks as context`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, k, resetKey, dark])

  return (
    <div>
      <div className="flex items-center gap-4 px-4 pt-3 pb-1">
        <div className="w-40">
          <Slider label="Retrieved docs K" value={k} min={1} max={5} step={1} onChange={v => setK(Math.round(v))} />
        </div>
        <div className="text-xs text-slate-400">
          Query: <span className="font-mono text-slate-600 dark:text-slate-300">{QUERY}</span>
        </div>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="RAG pipeline visualization"
      />
    </div>
  )
}
