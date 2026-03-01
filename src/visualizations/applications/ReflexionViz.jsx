import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 280
const LX = 12,  LW = 210  // left column (attempts)
const RX = 258, RW = 210  // right column (scores + reflection)

const ATT1 = [
  'Climate change stems from CO2 and',
  'other GHGs released by industry.',
  'Temps have risen since 1980.',
]
const REFLECT = [
  '· Missing: IPCC citations.',
  '· "1980" incorrect → use 1850.',
  '· Add sector breakdown (%)',
  '· Next: cite AR6, verify dates.',
]
const ATT2 = [
  'Human GHG emissions drive climate',
  'change (IPCC AR6, 2023, p.12).',
  'Energy: 73%, Agri: 18%, Ind: 9%.',
  'Global temps +1.1°C since 1850.',
]

// 0: attempt 1 | 1: score 1 | 2: reflection | 3: attempt 2 | 4: score 2
export const REFLEXION_STEPS = 5

export function ReflexionViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const bgFill     = dark ? '#1e293b' : '#f8fafc'
    const bgStroke   = dark ? '#334155' : '#e2e8f0'
    const bodyFill   = dark ? '#94a3b8' : '#475569'
    const reflBg     = dark ? '#451a03' : '#fffbeb'
    const reflFill   = dark ? '#fde68a' : '#92400e'
    const reflStroke = '#f59e0b'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const lineH = 15

    // === ATTEMPT 1 (always shown) ===
    svg.append('text').attr('x', LX).attr('y', 18).attr('font-size', 9).attr('font-weight', 700)
      .attr('fill', '#6366f1').text('ATTEMPT 1')
    const att1BoxH = ATT1.length * lineH + 22   // 67px
    svg.append('rect').attr('x', LX).attr('y', 24).attr('width', LW).attr('height', att1BoxH).attr('rx', 6)
      .attr('fill', bgFill).attr('stroke', bgStroke).attr('stroke-width', 1)
    ATT1.forEach((line, i) => {
      svg.append('text').attr('x', LX + 8).attr('y', 24 + 15 + i * lineH).attr('font-size', 9)
        .attr('fill', bodyFill).text(line)
    })

    // === SCORE 1 (step 1+) ===
    // Rect: y=24, h=36, bottom=60. "Evaluation" at y=76 (16px gap from bottom)
    if (step >= 1) {
      svg.append('rect').attr('x', RX).attr('y', 24).attr('width', 90).attr('height', 36).attr('rx', 6)
        .attr('fill', dark ? '#450a0a' : '#fee2e2').attr('stroke', '#ef4444').attr('stroke-width', 1.5)
      svg.append('text').attr('x', RX + 45).attr('y', 47).attr('text-anchor', 'middle')
        .attr('font-size', 14).attr('font-weight', 700).attr('fill', '#ef4444').text('3/10 ✗')
      svg.append('text').attr('x', RX + 45).attr('y', 76).attr('text-anchor', 'middle')
        .attr('font-size', 8).attr('fill', dark ? '#94a3b8' : '#64748b').text('Evaluation')
    }

    // === REFLECTION (step 2+) ===
    // Header at y=90 (14px gap from "Evaluation"). Box y=98, h=78, bottom=176
    if (step >= 2) {
      const refY = 90
      svg.append('text').attr('x', RX).attr('y', refY).attr('font-size', 9).attr('font-weight', 700)
        .attr('fill', reflFill).text('REFLECTION')
      const refBoxH = REFLECT.length * lineH + 18  // 78px
      svg.append('rect').attr('x', RX).attr('y', refY + 8).attr('width', RW).attr('height', refBoxH).attr('rx', 6)
        .attr('fill', reflBg).attr('stroke', reflStroke).attr('stroke-width', 1)
      REFLECT.forEach((line, i) => {
        svg.append('text').attr('x', RX + 8).attr('y', refY + 8 + 14 + i * lineH).attr('font-size', 9)
          .attr('fill', reflFill).text(line)
      })
    }

    // === ATTEMPT 2 (step 3+) ===
    // att2Y = 24 + 67 + 20 = 111. Box y=119, h=80, bottom=199
    if (step >= 3) {
      const att2Y = 24 + att1BoxH + 20
      svg.append('text').attr('x', LX).attr('y', att2Y).attr('font-size', 9).attr('font-weight', 700)
        .attr('fill', '#10b981').text('ATTEMPT 2')
      const att2BoxH = ATT2.length * lineH + 20  // 80px
      svg.append('rect').attr('x', LX).attr('y', att2Y + 8).attr('width', LW).attr('height', att2BoxH).attr('rx', 6)
        .attr('fill', dark ? '#052e16' : '#f0fdf4').attr('stroke', '#10b981').attr('stroke-width', 1.5)
      ATT2.forEach((line, i) => {
        svg.append('text').attr('x', LX + 8).attr('y', att2Y + 8 + 15 + i * lineH).attr('font-size', 9)
          .attr('fill', dark ? '#6ee7b7' : '#065f46').text(line)
      })
    }

    // === SCORE 2 (step 4+) ===
    // score2Y=188: 12px gap below refBox bottom (176). Rect bottom=224. "↑ Improved" at y=236 < H=280 ✓
    if (step >= 4) {
      const score2Y = 188
      svg.append('rect').attr('x', RX).attr('y', score2Y).attr('width', 90).attr('height', 36).attr('rx', 6)
        .attr('fill', dark ? '#052e16' : '#f0fdf4').attr('stroke', '#10b981').attr('stroke-width', 1.5)
      svg.append('text').attr('x', RX + 45).attr('y', score2Y + 23).attr('text-anchor', 'middle')
        .attr('font-size', 14).attr('font-weight', 700).attr('fill', '#10b981').text('9/10 ✓')
      svg.append('text').attr('x', RX + 45).attr('y', score2Y + 50).attr('text-anchor', 'middle')
        .attr('font-size', 8).attr('fill', dark ? '#94a3b8' : '#64748b').text('↑ Improved via reflection')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Reflexion agent self-correction visualization" />
  )
}
