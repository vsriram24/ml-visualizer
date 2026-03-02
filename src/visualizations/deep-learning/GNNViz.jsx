import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 520, H = 300

export const GNN_STEPS = 5

// step 0 = initial graph — some nodes labeled, others unknown
// step 1 = Layer 1 message passing — edges light up
// step 2 = Layer 1 aggregation complete — partial embeddings
// step 3 = Layer 2 message passing — edges light up again
// step 4 = Final classification — all nodes classified

// Node positions (fixed layout)
const NP = [
  { x: 260, y: 78  }, // 0 — top center
  { x: 148, y: 142 }, // 1 — upper left
  { x: 372, y: 142 }, // 2 — upper right
  { x:  90, y: 215 }, // 3 — lower far left
  { x: 430, y: 215 }, // 4 — lower far right
  { x: 190, y: 248 }, // 5 — lower center-left
  { x: 330, y: 248 }, // 6 — lower center-right
]

const EDGES = [
  [0, 1], [0, 2],
  [1, 2],
  [1, 3], [2, 4],
  [1, 5], [2, 6],
  [3, 5], [4, 6],
  [5, 6],
]

// Class A = teal brand, Class B = rose, Partial = lighter, Unknown = dark
const CA  = '#40798C'   // class A confirmed
const CPA = '#9ABDC4'   // class A partial (1-hop from A nodes)
const CB  = '#f43f5e'   // class B confirmed
const CPB = '#fca5a5'   // class B partial
const CUN = '#1A3D4A'   // unknown

// Labeled nodes: 0 (A), 3 (B), 4 (A)
// After layer 1: nodes 1,2,5,6 get partial signal from their labeled neighbors
// After layer 2: enough signal to classify all nodes
const NODE_COLORS = [
  [CA, CUN, CUN, CB, CA, CUN, CUN], // step 0: initial
  [CA, CUN, CUN, CB, CA, CUN, CUN], // step 1: edges glow (colors hold)
  [CA, CPA, CPA, CB, CA, CPB, CPA], // step 2: after layer 1
  [CA, CPA, CPA, CB, CA, CPB, CPA], // step 3: edges glow again
  [CA, CA,  CA,  CB, CA, CB,  CA],  // step 4: final classification
]

const NODE_LABELS = [
  ['A', '?', '?', 'B', 'A', '?', '?'],
  ['A', '?', '?', 'B', 'A', '?', '?'],
  ['A', '?', '?', 'B', 'A', '?', '?'],
  ['A', '?', '?', 'B', 'A', '?', '?'],
  ['A', 'A', 'A', 'B', 'A', 'B', 'A'],
]

// initially-labeled node indices
const LABELED = new Set([0, 3, 4])

export function GNNViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const textFg  = dark ? '#F6F1D1' : '#1e293b'
    const textDim = dark ? '#4a6070' : '#94a3b8'
    const lineDim = dark ? '#2a4555' : '#cbd5e1'

    const s = Math.min(step, 4)
    const colors = NODE_COLORS[s]
    const labels = NODE_LABELS[s]
    const edgeGlow = s === 1 || s === 3
    const NODE_R = 15

    // ── Title ──────────────────────────────────────────────
    svg.append('text').attr('x', W / 2).attr('y', 22)
      .attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 600)
      .attr('fill', textFg).text('GNN Message Passing — Node Classification')

    // ── Edges ──────────────────────────────────────────────
    EDGES.forEach(([a, b]) => {
      svg.append('line')
        .attr('x1', NP[a].x).attr('y1', NP[a].y)
        .attr('x2', NP[b].x).attr('y2', NP[b].y)
        .attr('stroke', edgeGlow ? CA : lineDim)
        .attr('stroke-width', edgeGlow ? 2.5 : 1.3)
        .attr('stroke-opacity', edgeGlow ? 0.85 : 0.55)
    })

    // During edge-glow steps, draw small animated "pulse" dots on each edge
    if (edgeGlow) {
      EDGES.forEach(([a, b]) => {
        const mx = (NP[a].x + NP[b].x) / 2
        const my = (NP[a].y + NP[b].y) / 2
        svg.append('circle').attr('cx', mx).attr('cy', my).attr('r', 3)
          .attr('fill', CA).attr('opacity', 0.9)
      })
    }

    // ── Nodes ──────────────────────────────────────────────
    NP.forEach(({ x, y }, i) => {
      const color = colors[i]
      const label = labels[i]
      const isLabeled = LABELED.has(i)
      const isClassified = s === 4

      // Outer ring for labeled nodes (thick white border = "ground truth")
      svg.append('circle').attr('cx', x).attr('cy', y).attr('r', NODE_R)
        .attr('fill', color)
        .attr('stroke', isLabeled || isClassified ? '#ffffff' : CA)
        .attr('stroke-width', isLabeled ? 2.5 : (isClassified ? 2 : 1.5))

      // Label text inside node
      const textColor = (color === CUN)
        ? CA                     // dark bg → teal text
        : (color === CPA || color === CPB)
          ? (dark ? '#0B2027' : '#1e293b')  // light partial bg → dark text
          : '#ffffff'            // saturated color → white text

      svg.append('text').attr('x', x).attr('y', y + 4)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
        .attr('fill', textColor).text(label)
    })

    // ── Legend ─────────────────────────────────────────────
    const LY = H - 30
    const legendItems = [
      { color: CA,  border: '#ffffff', label: 'Class A (labeled)' },
      { color: CB,  border: '#ffffff', label: 'Class B (labeled)' },
      { color: CUN, border: CA,        label: 'Unlabeled' },
    ]
    let lx = 30
    legendItems.forEach(({ color, border, label }) => {
      svg.append('circle').attr('cx', lx).attr('cy', LY).attr('r', 6)
        .attr('fill', color).attr('stroke', border).attr('stroke-width', 1.5)
      svg.append('text').attr('x', lx + 11).attr('y', LY + 4)
        .attr('font-size', 9).attr('fill', textDim).text(label)
      lx += label.length * 5.4 + 22
    })

    // ── Step annotation ────────────────────────────────────
    const notes = [
      'Semi-supervised: nodes 0, 3, 4 are labeled. The GNN must classify the remaining 4 using graph structure.',
      'Layer 1 forward pass: every node broadcasts its embedding along every incident edge.',
      'Layer 1 complete: nodes 1, 2, 5, 6 now hold aggregated 1-hop neighborhood information.',
      'Layer 2 forward pass: embeddings propagate again — each node now sees 2-hop context.',
      'Layer 2 complete: all nodes classified. Graph topology guided the predictions.',
    ]
    svg.append('text').attr('x', W / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle').attr('font-size', 9.5).attr('fill', textDim)
      .text(notes[s])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="GNN message passing visualization"
    />
  )
}
