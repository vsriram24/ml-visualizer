import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 310

// Fixed node positions — sol moved right so box (boxW=140, half=70) stays on-screen
const NODES = [
  { id: 'root', label: 'List top 3 GHG emitters', sub: '+ % contribution', x: 240, y: 34  },
  { id: 't1',   label: 'Energy sector first',      sub: null,              x: 118, y: 114  },
  { id: 't2',   label: 'By country',               sub: null,              x: 248, y: 114  },
  { id: 't3',   label: 'By gas type',              sub: null,              x: 378, y: 114  },
  { id: 't1a',  label: 'Energy=73%',               sub: 'Agri=18%',        x: 82,  y: 202  },
  { id: 't1b',  label: 'Regional breakdown',        sub: null,              x: 192, y: 202  },
  { id: 'sol',  label: 'China 30%, US 14%',        sub: 'EU 8% ✓',         x: 92,  y: 278  },
]

// Edges: [parentId, childId]
const EDGES = [
  ['root', 't1'], ['root', 't2'], ['root', 't3'],
  ['t1', 't1a'],  ['t1', 't1b'],
  ['t1a', 'sol'],
]

// Step schedule
// 0: root only
// 1: t1 | 2: t2 | 3: t3
// 4: score/prune — t2 & t3 pruned (red), t1 highlighted best (indigo)
// 5: t1a | 6: t1b
// 7: t1b pruned, t1a solution-path (green)
// 8: sol appears
export const TOT_STEPS = 9

function nodeVisible(id, step) {
  const appear = { root: 0, t1: 1, t2: 2, t3: 3, t1a: 5, t1b: 6, sol: 8 }
  return step >= (appear[id] ?? 99)
}

function nodeState(id, step) {
  if (!nodeVisible(id, step)) return 'hidden'
  if (id === 'sol') return step >= 8 ? 'solution' : 'hidden'
  if (id === 'root') return 'active'
  if ((id === 't2' || id === 't3') && step >= 4) return 'pruned'
  if (id === 't1b' && step >= 7) return 'pruned'
  if (id === 't1' && step >= 4) return 'best'
  if (id === 't1a' && step >= 7) return 'solution-path'
  return 'active'
}

function edgeVisible(parentId, childId, step) {
  return nodeVisible(parentId, step) && nodeVisible(childId, step)
}

export function TreeOfThoughtsViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const labelFill = dark ? '#f1f5f9' : '#1e293b'
    const subFill   = dark ? '#94a3b8' : '#64748b'
    const edgeGray  = dark ? '#334155' : '#cbd5e1'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // boxW / boxH lookup (used for edge offsets too)
    function getBoxDims(node) {
      const boxW = node.id === 'root' ? 170 : (node.id === 'sol' ? 140 : 110)
      const boxH = node.sub ? 38 : 26
      return { boxW, boxH }
    }

    // Draw edges first (behind nodes)
    EDGES.forEach(([pid, cid]) => {
      if (!edgeVisible(pid, cid, step)) return
      const p = NODES.find(n => n.id === pid)
      const c = NODES.find(n => n.id === cid)
      const cState = nodeState(cid, step)
      const pState = nodeState(pid, step)
      const { boxH: pH } = getBoxDims(p)
      const { boxH: cH } = getBoxDims(c)

      let stroke = edgeGray, strokeW = 1, dash = null
      if (cState === 'pruned' || pState === 'pruned')          { stroke = dark ? '#4b2020' : '#fca5a5'; dash = '4,3' }
      else if (cState === 'solution' || cState === 'solution-path') { stroke = '#10b981'; strokeW = 2 }
      else if (pState === 'best' && (cid === 't1a' || cid === 't1b')) { stroke = '#6366f1'; strokeW = 1.5 }

      const line = svg.append('line')
        .attr('x1', p.x).attr('y1', p.y + pH / 2)
        .attr('x2', c.x).attr('y2', c.y - cH / 2)
        .attr('stroke', stroke).attr('stroke-width', strokeW)
      if (dash) line.attr('stroke-dasharray', dash)
    })

    // Draw nodes
    NODES.forEach(node => {
      const state = nodeState(node.id, step)
      if (state === 'hidden') return

      const { boxW, boxH } = getBoxDims(node)

      let fill, stroke, strokeW, textFill
      if (state === 'pruned') {
        fill = dark ? '#1c0a0a' : '#fff1f2'; stroke = '#ef4444'; strokeW = 1
        textFill = dark ? '#7f1d1d' : '#ef4444'
      } else if (state === 'solution') {
        fill = dark ? '#052e16' : '#f0fdf4'; stroke = '#10b981'; strokeW = 2
        textFill = dark ? '#6ee7b7' : '#065f46'
      } else if (state === 'solution-path') {
        fill = dark ? '#052e16' : '#f0fdf4'; stroke = '#10b981'; strokeW = 1.5
        textFill = dark ? '#6ee7b7' : '#065f46'
      } else if (state === 'best') {
        fill = dark ? '#1e1b4b' : '#eef2ff'; stroke = '#6366f1'; strokeW = 2
        textFill = dark ? '#a5b4fc' : '#4338ca'
      } else {
        fill = dark ? '#1e293b' : '#f8fafc'; stroke = dark ? '#334155' : '#cbd5e1'; strokeW = 1
        textFill = labelFill
      }

      svg.append('rect')
        .attr('x', node.x - boxW / 2).attr('y', node.y - boxH / 2)
        .attr('width', boxW).attr('height', boxH).attr('rx', 6)
        .attr('fill', fill).attr('stroke', stroke).attr('stroke-width', strokeW)

      svg.append('text')
        .attr('x', node.x).attr('y', node.y + (node.sub ? -4 : 4))
        .attr('text-anchor', 'middle').attr('font-size', 9.5).attr('font-weight', 600)
        .attr('fill', textFill).text(node.label)

      if (node.sub) {
        svg.append('text')
          .attr('x', node.x).attr('y', node.y + 11)
          .attr('text-anchor', 'middle').attr('font-size', 8.5)
          .attr('fill', state === 'pruned' || state === 'solution' || state === 'solution-path' ? textFill : subFill)
          .text(node.sub)
      }

      // Score badges at step 4 — placed BELOW each node (centered), clear of box borders
      if (step >= 4 && node.id === 't1') {
        svg.append('text').attr('x', node.x).attr('y', node.y + boxH / 2 + 14)
          .attr('text-anchor', 'middle').attr('font-size', 9).attr('font-weight', 700)
          .attr('fill', '#6366f1').text('★ best (0.9)')
      }
      if (step >= 4 && node.id === 't2') {
        svg.append('text').attr('x', node.x).attr('y', node.y + boxH / 2 + 13)
          .attr('text-anchor', 'middle').attr('font-size', 9)
          .attr('fill', dark ? '#f87171' : '#ef4444').text('score: 0.3 ✗')
      }
      if (step >= 4 && node.id === 't3') {
        svg.append('text').attr('x', node.x).attr('y', node.y + boxH / 2 + 13)
          .attr('text-anchor', 'middle').attr('font-size', 9)
          .attr('fill', dark ? '#f87171' : '#ef4444').text('score: 0.2 ✗')
      }
    })

    // Legend (bottom-right, no overlap with sol node which is on the left)
    const legendX = W - 12
    const legItems = [
      { color: '#6366f1', text: 'Best path' },
      { color: '#10b981', text: 'Solution'  },
      { color: '#ef4444', text: 'Pruned'    },
    ]
    const legendBg     = dark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)'
    const legendStroke = dark ? '#334155' : '#e2e8f0'
    svg.append('rect')
      .attr('x', legendX - 84).attr('y', H - 62)
      .attr('width', 84).attr('height', 58).attr('rx', 4)
      .attr('fill', legendBg).attr('stroke', legendStroke)
    legItems.forEach((l, i) => {
      svg.append('circle').attr('cx', legendX - 72).attr('cy', H - 50 + i * 18).attr('r', 5).attr('fill', l.color)
      svg.append('text').attr('x', legendX - 64).attr('y', H - 46 + i * 18)
        .attr('font-size', 8.5).attr('fill', subFill).text(l.text)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg" aria-label="Tree of Thoughts reasoning exploration visualization" />
  )
}
