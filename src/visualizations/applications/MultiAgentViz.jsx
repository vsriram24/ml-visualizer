import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 360

// steps 0–2: Hierarchical
// steps 3–5: Pipeline
// steps 6–8: Peer-to-Peer
export const MULTI_AGENT_STEPS = 9

// Band extents — generous heights to avoid cramping
//   B1: 8..122 (114px) — Hierarchical: header + manager + 28px arrow gap + workers
//   B2: 134..224 (90px) — Pipeline: header + 4 boxes
//   B3: 236..352 (116px) — P2P: header + top row + 46px gap + bottom row
const B1_Y = 8,   B1_H = 114
const B2_Y = 134, B2_H = 90
const B3_Y = 236, B3_H = 116

export function MultiAgentViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const subFill  = dark ? '#94a3b8' : '#64748b'
    const boxBg    = dark ? '#1e293b' : '#f8fafc'
    const boxStr   = dark ? '#334155' : '#cbd5e1'
    const amber    = '#f59e0b'
    const indigo   = '#6366f1'
    const green    = '#10b981'
    const purple   = '#8b5cf6'
    const bandBg   = dark ? 'rgba(30,41,59,0.5)' : 'rgba(248,250,252,0.8)'
    const bandStr  = dark ? '#334155' : '#e2e8f0'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // ── HELPERS ──────────────────────────────────────────────────────────────
    function drawBox(x, y, w, h, label, active, color) {
      const bg  = active ? (dark ? `${color}22` : `${color}18`) : boxBg
      const str = active ? color : boxStr
      svg.append('rect').attr('x', x).attr('y', y).attr('width', w).attr('height', h)
        .attr('rx', 6).attr('fill', bg).attr('stroke', str).attr('stroke-width', active ? 2 : 1)
      svg.append('text').attr('x', x + w / 2).attr('y', y + h / 2 + 4)
        .attr('text-anchor', 'middle').attr('font-size', 8.5).attr('font-weight', 600)
        .attr('fill', active ? color : subFill).text(label)
    }

    function arrowLine(x1, y1, x2, y2, active, label) {
      const color = active ? amber : (dark ? '#334155' : '#e2e8f0')
      svg.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke', color).attr('stroke-width', active ? 2.5 : 1)
        .attr('marker-end', active ? 'url(#arrow-amber)' : 'url(#arrow-gray)')
      if (active && label) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        svg.append('rect').attr('x', mx - 20).attr('y', my - 9).attr('width', 40).attr('height', 16)
          .attr('rx', 3).attr('fill', dark ? '#78350f' : '#fef3c7')
        svg.append('text').attr('x', mx).attr('y', my + 2)
          .attr('text-anchor', 'middle').attr('font-size', 7.5).attr('fill', dark ? '#fde68a' : '#92400e')
          .text(label)
      }
    }

    function biArrow(x1, y1, x2, y2, active) {
      const color = active ? amber : (dark ? '#334155' : '#e2e8f0')
      svg.append('line').attr('x1', x1).attr('y1', y1).attr('x2', x2).attr('y2', y2)
        .attr('stroke', color).attr('stroke-width', active ? 2 : 1)
        .attr('marker-end',   active ? 'url(#arrow-amber)' : 'url(#arrow-gray)')
        .attr('marker-start', active ? 'url(#arrow-amber)' : 'url(#arrow-gray)')
      if (active) {
        const mx = (x1 + x2) / 2, my = (y1 + y2) / 2
        svg.append('circle').attr('cx', mx).attr('cy', my).attr('r', 4)
          .attr('fill', amber).attr('stroke', 'white').attr('stroke-width', 1)
      }
    }

    // Arrow markers
    const defs = svg.append('defs')
    ;['amber', 'gray'].forEach(name => {
      defs.append('marker').attr('id', `arrow-${name}`)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('refX', 5).attr('refY', 3).attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L0,6 L6,3 Z')
        .attr('fill', name === 'amber' ? amber : (dark ? '#334155' : '#e2e8f0'))
    })

    // Band backgrounds
    ;[[B1_Y, B1_H, indigo], [B2_Y, B2_H, purple], [B3_Y, B3_H, green]].forEach(([by, bh]) => {
      svg.append('rect').attr('x', 4).attr('y', by).attr('width', W - 8).attr('height', bh)
        .attr('rx', 6).attr('fill', bandBg).attr('stroke', bandStr).attr('stroke-width', 1)
    })

    // ── BAND 1: HIERARCHICAL ─────────────────────────────────────────────────
    // Layout: header y=24, manager y=38..64, workers y=90..116, arrow span=26px
    svg.append('text').attr('x', 12).attr('y', B1_Y + 18)
      .attr('font-size', 8).attr('font-weight', 700).attr('fill', indigo)
      .text('HIERARCHICAL (Manager → Workers)')

    const mgX = 196, mgY = B1_Y + 30, mgW = 88, mgH = 26
    const wY  = B1_Y + 82, wH = 26, wW = 76
    const wXs = [20, 198, 376]

    drawBox(mgX, mgY, mgW, mgH, 'Manager LLM', step >= 0 && step <= 2, indigo)

    wXs.forEach((wx, i) => {
      const wActive = step === i
      const wcx = wx + wW / 2
      const mcx = mgX + mgW / 2
      // Draw delegate arrow first (behind boxes)
      arrowLine(mcx, mgY + mgH, wcx, wY, wActive, 'delegate')
      drawBox(wx, wY, wW, wH, `Worker ${i + 1}`, wActive, green)
    })

    // ── BAND 2: PIPELINE ─────────────────────────────────────────────────────
    // Layout: header y=152, boxes y=168..194
    svg.append('text').attr('x', 12).attr('y', B2_Y + 18)
      .attr('font-size', 8).attr('font-weight', 700).attr('fill', purple)
      .text('PIPELINE (Sequential Handoffs)')

    const pLabels = ['Gather', 'Analyze', 'Critique', 'Write']
    const pW = 76, pH = 26, pGap = 14
    const pY = B2_Y + 34
    const pStartX = (W - (pLabels.length * pW + (pLabels.length - 1) * pGap)) / 2

    pLabels.forEach((label, i) => {
      const px = pStartX + i * (pW + pGap)
      // Step 5 activates both Critique (i=2) and Write (i=3) to show completion
      const pActive = step === 3 + i || (i === 3 && step === 5)
      drawBox(px, pY, pW, pH, label, pActive, purple)
      if (i < pLabels.length - 1) {
        const ax1 = px + pW, ay = pY + pH / 2, ax2 = px + pW + pGap
        arrowLine(ax1, ay, ax2, ay, step === 3 + i, null)
      }
    })

    // ── BAND 3: PEER-TO-PEER ─────────────────────────────────────────────────
    // Layout: header y=254, top row y=268..294, bottom row y=314..340
    // Arrow gap between rows: 314-294=20px — enough for midpoint dot
    svg.append('text').attr('x', 12).attr('y', B3_Y + 18)
      .attr('font-size', 8).attr('font-weight', 700).attr('fill', green)
      .text('PEER-TO-PEER (Collaborative)')

    const p2W = 80, p2H = 26
    const p2Positions = [
      { x: 78,  y: B3_Y + 32 },   // A — top-left:    78..158
      { x: 302, y: B3_Y + 32 },   // B — top-right:  302..382
      { x: 78,  y: B3_Y + 78 },   // C — bot-left:    78..158
      { x: 302, y: B3_Y + 78 },   // D — bot-right:  302..382
    ]
    const p2Labels = ['Agent A', 'Agent B', 'Agent C', 'Agent D']

    const activePairs = [[0, 1], [1, 3], [0, 2]]
    const activePair = step >= 6 && step <= 8 ? activePairs[step - 6] : []

    const isEdgeActive = (a, b) => activePair.includes(a) && activePair.includes(b)

    // A–B horizontal (top)
    biArrow(p2Positions[0].x + p2W, p2Positions[0].y + p2H / 2,
            p2Positions[1].x,       p2Positions[1].y + p2H / 2,
            isEdgeActive(0, 1))
    // C–D horizontal (bottom)
    biArrow(p2Positions[2].x + p2W, p2Positions[2].y + p2H / 2,
            p2Positions[3].x,       p2Positions[3].y + p2H / 2,
            isEdgeActive(2, 3))
    // A–C vertical (left)
    biArrow(p2Positions[0].x + p2W / 2, p2Positions[0].y + p2H,
            p2Positions[2].x + p2W / 2, p2Positions[2].y,
            isEdgeActive(0, 2))
    // B–D vertical (right)
    biArrow(p2Positions[1].x + p2W / 2, p2Positions[1].y + p2H,
            p2Positions[3].x + p2W / 2, p2Positions[3].y,
            isEdgeActive(1, 3))

    // Draw agent boxes on top of arrows
    p2Positions.forEach((pos, i) => {
      drawBox(pos.x, pos.y, p2W, p2H, p2Labels[i], activePair.includes(i), green)
    })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Multi-agent coordination patterns visualization" />
  )
}
