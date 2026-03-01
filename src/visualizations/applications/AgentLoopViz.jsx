import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 340

const LOOP_STEPS = [
  {
    phase: 'Observe', color: '#06b6d4', icon: '👁',
    content: 'Search results: "Climate change refers to long-term shifts in temperatures caused primarily by human activities..."',
  },
  {
    phase: 'Think', color: '#8b5cf6', icon: '🧠',
    content: 'I need to find (1) main causes and (2) evidence. Let me search for CO₂ data next.',
  },
  {
    phase: 'Act', color: '#f59e0b', icon: '⚡',
    content: 'Tool: web_search("CO2 emissions by sector 2023")',
  },
  {
    phase: 'Observe', color: '#06b6d4', icon: '👁',
    content: 'Tool result: Energy (73%), Agriculture (18%), Industrial (9%)...',
  },
  {
    phase: 'Think', color: '#8b5cf6', icon: '🧠',
    content: 'I now have sufficient context to answer the question comprehensively.',
  },
  {
    phase: 'Respond', color: '#10b981', icon: '✅',
    content: 'Climate change is primarily caused by human activities that emit greenhouse gases, particularly CO₂ from burning fossil fuels...',
  },
]

// Each step reveals one more ReAct loop entry. step 0 = first entry shown.
export const AGENT_STEPS = LOOP_STEPS.length

export function AgentLoopViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const currentStep = Math.min(step, LOOP_STEPS.length - 1)

    const titleFill      = dark ? '#f1f5f9' : '#1e293b'
    const toolBarBg      = dark ? '#1e293b' : '#f1f5f9'
    const toolBarStroke  = dark ? '#334155' : '#e2e8f0'
    const toolActiveBarBg = dark ? '#451a03' : '#fef3c7'
    const toolTextFill   = dark ? '#94a3b8' : '#475569'
    const traceLabelFill = dark ? '#94a3b8' : '#64748b'
    const traceRowBg     = dark ? '#1e293b' : '#f8fafc'
    const traceRowStroke = dark ? '#334155' : '#e2e8f0'
    const contentFill    = dark ? '#94a3b8' : '#475569'
    const answerBg       = dark ? '#052e16' : '#f0fdf4'
    const answerText     = dark ? '#34d399' : '#065f46'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('text').attr('x', W / 2).attr('y', 20).attr('text-anchor', 'middle')
      .attr('font-size', 12).attr('font-weight', 700).attr('fill', titleFill).text('ReAct Agent Loop')

    // Tool bar
    const tools = ['🔍 web_search', '💻 code_exec', '🧮 calculator', '📄 file_read']
    const toolY = 38, toolW = 96
    tools.forEach((t, i) => {
      const tx = 12 + i * (toolW + 6)
      const isActive = LOOP_STEPS[currentStep]?.phase === 'Act' && i === 0
      svg.append('rect').attr('x', tx).attr('y', toolY).attr('width', toolW).attr('height', 22).attr('rx', 4)
        .attr('fill', isActive ? toolActiveBarBg : toolBarBg)
        .attr('stroke', isActive ? '#f59e0b' : toolBarStroke).attr('stroke-width', isActive ? 2 : 1)
      svg.append('text').attr('x', tx + toolW / 2).attr('y', toolY + 14).attr('text-anchor', 'middle')
        .attr('font-size', 9).attr('fill', toolTextFill).text(t)
    })

    svg.append('text').attr('x', 12).attr('y', 80)
      .attr('font-size', 10).attr('font-weight', 600).attr('fill', traceLabelFill).text('Trace')

    // Show steps 0..currentStep
    const visibleSteps = LOOP_STEPS.slice(0, currentStep + 1)
    visibleSteps.forEach((s, i) => {
      const y = 94 + i * 34
      const isCurrentStep = i === currentStep

      svg.append('rect').attr('x', 12).attr('y', y - 2).attr('width', W - 24).attr('height', 28).attr('rx', 5)
        .attr('fill', isCurrentStep ? s.color + '22' : traceRowBg)
        .attr('stroke', isCurrentStep ? s.color : traceRowStroke)
        .attr('stroke-width', isCurrentStep ? 1.5 : 1)

      svg.append('text').attr('x', 22).attr('y', y + 13).attr('font-size', 12).text(s.icon)

      svg.append('text').attr('x', 38).attr('y', y + 9)
        .attr('font-size', 9).attr('font-weight', 700).attr('fill', s.color).text(s.phase + ':')

      const maxChars = 65
      const content = s.content.length > maxChars ? s.content.slice(0, maxChars) + '…' : s.content
      svg.append('text').attr('x', 82).attr('y', y + 9)
        .attr('font-size', 9).attr('fill', contentFill).text(content)
    })

    // Final answer banner
    if (currentStep === LOOP_STEPS.length - 1) {
      svg.append('rect').attr('x', 12).attr('y', H - 28).attr('width', W - 24).attr('height', 20).attr('rx', 5)
        .attr('fill', answerBg).attr('stroke', '#10b981').attr('stroke-width', 1.5)
      svg.append('text').attr('x', W / 2).attr('y', H - 14).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('font-weight', 600).attr('fill', answerText)
        .text('✅ Task completed in 2 tool calls')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="ReAct agent loop visualization"
    />
  )
}
