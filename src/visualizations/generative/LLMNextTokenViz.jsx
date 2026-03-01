import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 220

const GENERATION_STEPS = [
  { context: ['The', 'quick', 'brown'], candidates: [
    { tok: 'fox', prob: 0.42 }, { tok: 'cat', prob: 0.18 }, { tok: 'dog', prob: 0.12 },
    { tok: 'bear', prob: 0.08 }, { tok: 'bird', prob: 0.06 }, { tok: 'deer', prob: 0.04 },
    { tok: 'wolf', prob: 0.03 }, { tok: 'rabbit', prob: 0.03 }, { tok: 'mouse', prob: 0.02 }, { tok: 'fish', prob: 0.02 },
  ]},
  { context: ['The', 'quick', 'brown', 'fox'], candidates: [
    { tok: 'jumps', prob: 0.35 }, { tok: 'runs', prob: 0.22 }, { tok: 'leaps', prob: 0.14 },
    { tok: 'sits', prob: 0.09 }, { tok: 'walked', prob: 0.07 }, { tok: 'sprints', prob: 0.05 },
    { tok: 'chases', prob: 0.04 }, { tok: 'hides', prob: 0.02 }, { tok: 'sleeps', prob: 0.01 }, { tok: 'growls', prob: 0.01 },
  ]},
  { context: ['The', 'quick', 'brown', 'fox', 'jumps'], candidates: [
    { tok: 'over', prob: 0.58 }, { tok: 'onto', prob: 0.14 }, { tok: 'into', prob: 0.09 },
    { tok: 'across', prob: 0.07 }, { tok: 'above', prob: 0.05 }, { tok: 'around', prob: 0.03 },
    { tok: 'through', prob: 0.02 }, { tok: 'toward', prob: 0.01 }, { tok: 'from', prob: 0.005 }, { tok: 'near', prob: 0.005 },
  ]},
]

function applyTemperature(candidates, temp) {
  const logits = candidates.map(c => Math.log(c.prob + 1e-10) / temp)
  const maxL = Math.max(...logits)
  const exps = logits.map(l => Math.exp(l - maxL))
  const sum = d3.sum(exps)
  return candidates.map((c, i) => ({ ...c, prob: exps[i] / sum }))
}

// Each step cycles through generation steps. loops=true.
export const LLM_STEPS = GENERATION_STEPS.length

export function LLMNextTokenViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const [temp, setTemp] = useState(1.0)
  const { dark } = useTheme()

  const stepIdx = step % GENERATION_STEPS.length

  useEffect(() => {
    const genStep = GENERATION_STEPS[stepIdx]
    const candidates = applyTemperature(genStep.candidates, temp).slice(0, 8)
    const maxProb = Math.max(...candidates.map(c => c.prob))

    const tokenBg     = dark ? '#2e1065' : '#ede9fe'
    const tokenText   = dark ? '#c4b5fd' : '#5b21b6'
    const barLabelFill = dark ? '#e2e8f0' : '#1e293b'
    const pctFill     = dark ? '#94a3b8' : '#64748b'
    const tempFill    = dark ? '#94a3b8' : '#64748b'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const tokenH = 28, tokenW = 48, startX = 16, tokenY = 20
    genStep.context.forEach((tok, i) => {
      const x = startX + i * (tokenW + 4)
      const g = svg.append('g')
      g.append('rect').attr('x', x).attr('y', tokenY).attr('width', tokenW).attr('height', tokenH)
        .attr('rx', 6).attr('fill', tokenBg).attr('stroke', '#8b5cf6').attr('stroke-width', 1.5)
      g.append('text').attr('x', x + tokenW / 2).attr('y', tokenY + 18).attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('font-weight', 600).attr('fill', tokenText).text(tok)
    })

    const arrowX = startX + genStep.context.length * (tokenW + 4)
    svg.append('text').attr('x', arrowX).attr('y', tokenY + 18).attr('font-size', 18).attr('fill', '#6366f1').text('→')
    svg.append('text').attr('x', arrowX + 26).attr('y', tokenY + 13).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#94a3b8').text('next')
    svg.append('text').attr('x', arrowX + 26).attr('y', tokenY + 24).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', '#94a3b8').text('token?')

    const chartX = 16, chartY = 72
    const barH = 18, barGap = 4
    const barMaxW = W - chartX - 90

    candidates.forEach((c, i) => {
      const y = chartY + i * (barH + barGap)
      const barW = (c.prob / maxProb) * barMaxW

      svg.append('text').attr('x', chartX + 52).attr('y', y + barH - 5).attr('text-anchor', 'end')
        .attr('font-size', 11).attr('font-weight', 600).attr('fill', barLabelFill).text(`"${c.tok}"`)

      svg.append('rect').attr('x', chartX + 56).attr('y', y).attr('width', barW).attr('height', barH).attr('rx', 3)
        .attr('fill', d3.interpolateViridis(c.prob / maxProb)).attr('opacity', 0.85)

      svg.append('text').attr('x', chartX + 60 + barW).attr('y', y + barH - 5)
        .attr('font-size', 10).attr('fill', pctFill).text(`${(c.prob * 100).toFixed(1)}%`)
    })

    svg.append('text').attr('x', W - 12).attr('y', 16).attr('text-anchor', 'end')
      .attr('font-size', 10).attr('fill', tempFill).text(`T=${temp.toFixed(1)}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIdx, temp, resetKey, dark])

  return (
    <div>
      <div className="flex items-center gap-6 px-4 pt-3 pb-2">
        <div className="w-44">
          <Slider label="Temperature" value={temp} min={0.1} max={2.0} step={0.1} onChange={setTemp} />
        </div>
        <div className="flex gap-2">
          {GENERATION_STEPS.map((_, i) => (
            <span key={i}
              className={`px-2.5 py-1 text-xs rounded-full ${stepIdx === i ? 'bg-brand-500 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}
            >Step {i + 1}</span>
          ))}
        </div>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="LLM next token probability distribution"
      />
    </div>
  )
}
