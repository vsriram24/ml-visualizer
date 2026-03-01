import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 260

const PLAN = [
  { label: '1. Search for recent studies and statistics', tool: 'web_search', result: 'Found 12 papers (2020–2024), 3 IPCC reports' },
  { label: '2. Identify key economic indicators',         tool: 'web_search', result: 'GDP +2.1%, Jobs +800K, Cost savings $340B/yr' },
  { label: '3. Compare costs: fossil fuels vs. renewables', tool: 'code_exec', result: 'Renewables 40% cheaper per MWh by 2024' },
  { label: '4. Synthesize findings into structured report', tool: null,       result: '✅ Report: 3 sections, 8 charts, 24 citations' },
]

// step 0: task only | step 1: plan revealed | steps 2–5: items complete one by one
export const PLAN_EXECUTE_STEPS = 6

export function PlanExecuteViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const dimFill    = dark ? '#475569' : '#94a3b8'
    const bgFill     = dark ? '#1e293b' : '#f8fafc'
    const bgStroke   = dark ? '#334155' : '#e2e8f0'
    const doneBg     = dark ? '#052e16' : '#f0fdf4'
    const doneStroke = '#10b981'
    const doneFill   = dark ? '#6ee7b7' : '#065f46'
    const resultFill = dark ? '#4ade80' : '#16a34a'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Task box
    svg.append('rect').attr('x', 12).attr('y', 8).attr('width', W - 24).attr('height', 34).attr('rx', 6)
      .attr('fill', dark ? '#1e3a5f' : '#dbeafe').attr('stroke', '#3b82f6').attr('stroke-width', 1.5)
    svg.append('text').attr('x', 22).attr('y', 21).attr('font-size', 9).attr('font-weight', 700)
      .attr('fill', dark ? '#93c5fd' : '#1d4ed8').text('TASK')
    svg.append('text').attr('x', 22).attr('y', 35).attr('font-size', 10)
      .attr('fill', dark ? '#bfdbfe' : '#1e40af')
      .text('Analyze economic impact of renewable energy adoption')

    if (step < 1) return

    // Planner LLM header
    svg.append('text').attr('x', 12).attr('y', 57).attr('font-size', 9).attr('font-weight', 700)
      .attr('fill', '#8b5cf6').text('PLANNER LLM — task decomposition:')

    // Plan items: y = 64, 106, 148, 190 (42px spacing; done items get 38px rect, pending 26px)
    PLAN.forEach((item, i) => {
      const done = step >= 2 + i
      const y    = 64 + i * 42
      const rH   = done ? 38 : 26

      svg.append('rect').attr('x', 12).attr('y', y - 2).attr('width', W - 24).attr('height', rH).attr('rx', 5)
        .attr('fill', done ? doneBg : bgFill).attr('stroke', done ? doneStroke : bgStroke).attr('stroke-width', 1)

      svg.append('text').attr('x', 22).attr('y', y + 12).attr('font-size', 10)
        .attr('fill', done ? doneFill : dimFill)
        .text(`${done ? '✓' : '·'} ${item.label}`)

      if (done) {
        svg.append('text').attr('x', 30).attr('y', y + 26).attr('font-size', 9)
          .attr('fill', resultFill).text(`→ ${item.result}`)
        if (item.tool) {
          svg.append('text').attr('x', W - 18).attr('y', y + 12).attr('text-anchor', 'end')
            .attr('font-size', 8).attr('fill', '#8b5cf6').attr('font-family', 'monospace').text(item.tool)
        }
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Plan-and-Execute agent visualization" />
  )
}
