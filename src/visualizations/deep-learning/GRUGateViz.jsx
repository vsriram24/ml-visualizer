import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 520, H = 275

export const GRU_STEPS = 4

// step 0 = structure visible (dim)
// step 1 = reset gate fires  → r_t gates how much h_{t-1} the candidate sees
// step 2 = candidate c̃_t computed using r_t ⊙ h_{t-1} and x_t
// step 3 = update gate z_t interpolates → h_t  (no separate cell state)

export function GRUGateViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const textFg  = dark ? '#F6F1D1' : '#1e293b'
    const textDim = dark ? '#4a6070' : '#94a3b8'
    const lineDim = dark ? '#2a4555' : '#cbd5e1'
    const cardBg  = dark ? '#0F2B35' : '#f8fafc'

    // Gate colors
    const CR = '#ef4444'   // reset  – red
    const CC = '#06b6d4'   // candidate – cyan
    const CZ = '#3b82f6'   // update – blue
    const CH = '#f59e0b'   // hidden state – amber

    // Layout — two rows
    // Top row:    h_{t-1} bypass path (y=90)
    // Middle row: gate boxes (y=170)
    // Bottom:     x_t label (y=245)
    // Right:      h_t + ⊕ at (y=130)

    const Y_TOP  = 90    // top bypass row
    const Y_GATE = 165   // gate box center row
    const Y_BOT  = 245   // x_t label
    const Y_OUT  = 128   // interpolation ⊕ and h_t

    const X_LEFT  = 30   // h_{t-1}
    const X_R  = 118     // reset gate box center
    const X_C  = 258     // candidate box center
    const X_Z  = 398     // update gate box center
    const X_ADD = 458    // ⊕ interpolation center
    const X_HT  = 496    // h_t

    const BW = 80, BH = 42
    const OP_R = 12

    // ── Arrow markers ──────────────────────────────────────
    const defs = svg.append('defs')
    const mkArrow = (id, color) =>
      defs.append('marker').attr('id', id)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('refX', 6).attr('refY', 3).attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L6,3 L0,6 Z').attr('fill', color)

    mkArrow('gr', step >= 1 ? CR : lineDim)
    mkArrow('gc', step >= 2 ? CC : lineDim)
    mkArrow('gz', step >= 3 ? CZ : lineDim)
    mkArrow('gh', step >= 3 ? CH : lineDim)
    mkArrow('gd', lineDim)

    // ── Title ──────────────────────────────────────────────
    svg.append('text').attr('x', W / 2).attr('y', 22)
      .attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 600)
      .attr('fill', textFg).text('GRU Cell — Gate Operations')

    svg.append('text').attr('x', W / 2).attr('y', 38)
      .attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', textDim)
      .text('No separate cell state — single h\u1D57 acts as both hidden state and memory')

    // ── Top bypass path: h_{t-1} → ⊕ ─────────────────────
    // h_{t-1} label
    svg.append('text').attr('x', X_LEFT + 5).attr('y', Y_TOP + 4)
      .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700)
      .attr('fill', step >= 3 ? CH : textDim).text('h')
    svg.append('text').attr('x', X_LEFT + 10).attr('y', Y_TOP + 8)
      .attr('text-anchor', 'start').attr('font-size', 8)
      .attr('fill', step >= 3 ? CH : textDim).text('t-1')

    // Bypass line: h_{t-1} → ⊕ (top path, labeled "(1−z) ⊙")
    svg.append('line')
      .attr('x1', X_LEFT + 22).attr('y1', Y_TOP)
      .attr('x2', X_ADD - OP_R - 1).attr('y2', Y_TOP)
      .attr('stroke', step >= 3 ? CH : lineDim).attr('stroke-width', 2)
    // Elbow down from bypass to ⊕
    svg.append('line')
      .attr('x1', X_ADD).attr('y1', Y_TOP)
      .attr('x2', X_ADD).attr('y2', Y_OUT - OP_R - 1)
      .attr('stroke', step >= 3 ? CH : lineDim).attr('stroke-width', 2)

    // Label "(1−z) ⊙" on the bypass line
    if (step >= 3) {
      svg.append('text').attr('x', (X_LEFT + 22 + X_ADD) / 2).attr('y', Y_TOP - 7)
        .attr('text-anchor', 'middle').attr('font-size', 8.5).attr('fill', CH)
        .text('(1 \u2212 z\u1D57) \u2299')
    }

    // ── ⊕ interpolation circle ─────────────────────────────
    svg.append('circle').attr('cx', X_ADD).attr('cy', Y_OUT).attr('r', OP_R)
      .attr('fill', cardBg).attr('stroke', step >= 3 ? CH : lineDim).attr('stroke-width', 2)
    svg.append('text').attr('x', X_ADD).attr('y', Y_OUT + 5)
      .attr('text-anchor', 'middle').attr('font-size', 14)
      .attr('fill', step >= 3 ? CH : textDim).text('+')

    // ⊕ → h_t
    svg.append('line')
      .attr('x1', X_ADD + OP_R + 1).attr('y1', Y_OUT)
      .attr('x2', X_HT - 12).attr('y2', Y_OUT)
      .attr('stroke', step >= 3 ? CH : lineDim).attr('stroke-width', 2)
      .attr('marker-end', 'url(#gh)')

    // h_t label
    svg.append('text').attr('x', X_HT - 2).attr('y', Y_OUT + 4)
      .attr('text-anchor', 'middle').attr('font-size', 11).attr('font-weight', 700)
      .attr('fill', step >= 3 ? CH : textDim).text('h')
    svg.append('text').attr('x', X_HT + 4).attr('y', Y_OUT + 8)
      .attr('text-anchor', 'start').attr('font-size', 8)
      .attr('fill', step >= 3 ? CH : textDim).text('t')

    // ── Gate box helper ────────────────────────────────────
    const gateBox = (cx, cy, title, sub, color, active) => {
      svg.append('rect')
        .attr('x', cx - BW / 2).attr('y', cy - BH / 2)
        .attr('width', BW).attr('height', BH).attr('rx', 7)
        .attr('fill', active ? `${color}18` : cardBg)
        .attr('stroke', active ? color : lineDim)
        .attr('stroke-width', active ? 2 : 1)
      svg.append('text').attr('x', cx).attr('y', cy - 7)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 700)
        .attr('fill', active ? color : textDim).text(title)
      svg.append('text').attr('x', cx).attr('y', cy + 9)
        .attr('text-anchor', 'middle').attr('font-size', 8.5)
        .attr('fill', active ? `${color}cc` : textDim).text(sub)
    }

    gateBox(X_R, Y_GATE, 'Reset Gate',  'r = σ(Wr·[h,x])',     CR, step >= 1)
    gateBox(X_C, Y_GATE, 'Candidate',   'c̃ = tanh(Wc·[r⊙h,x])', CC, step >= 2)
    gateBox(X_Z, Y_GATE, 'Update Gate', 'z = σ(Wz·[h,x])',     CZ, step >= 3)

    // ── h_{t-1} split: down to reset gate ─────────────────
    // Vertical drop from top path down to reset gate
    svg.append('line')
      .attr('x1', X_LEFT + 15).attr('y1', Y_TOP + 2)
      .attr('x2', X_R).attr('y2', Y_GATE - BH / 2 - 1)
      .attr('stroke', step >= 1 ? CR : lineDim)
      .attr('stroke-width', step >= 1 ? 1.5 : 1)
      .attr('marker-end', 'url(#gr)')

    // Reset gate → candidate (r_t ⊙ h_{t-1} flows into candidate)
    svg.append('line')
      .attr('x1', X_R + BW / 2 + 1).attr('y1', Y_GATE)
      .attr('x2', X_C - BW / 2 - 1).attr('y2', Y_GATE)
      .attr('stroke', step >= 2 ? CC : lineDim)
      .attr('stroke-width', step >= 2 ? 1.5 : 1)
      .attr('marker-end', 'url(#gc)')

    // Label on the reset→candidate arrow
    if (step >= 2) {
      svg.append('text').attr('x', (X_R + BW / 2 + X_C - BW / 2) / 2).attr('y', Y_GATE - 9)
        .attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', CC)
        .text('r\u1D57 \u2299 h\u1D57\u207B\u00B9')
    }

    // Candidate → ⊕ (via update gate interpolation)
    svg.append('line')
      .attr('x1', X_C + BW / 2 + 1).attr('y1', Y_GATE)
      .attr('x2', X_Z - BW / 2 - 1).attr('y2', Y_GATE)
      .attr('stroke', step >= 3 ? CZ : lineDim)
      .attr('stroke-width', step >= 3 ? 1.5 : 1)
      .attr('marker-end', 'url(#gz)')

    // Update gate → ⊕ (elbow up)
    svg.append('line')
      .attr('x1', X_Z).attr('y1', Y_GATE - BH / 2 - 1)
      .attr('x2', X_ADD).attr('y2', Y_OUT + OP_R + 1)
      .attr('stroke', step >= 3 ? CZ : lineDim)
      .attr('stroke-width', step >= 3 ? 1.5 : 1)
      .attr('marker-end', 'url(#gz)')

    // Label "z ⊙ c̃" on update→⊕ arrow
    if (step >= 3) {
      svg.append('text').attr('x', X_Z + 18).attr('y', Y_GATE - BH / 2 - 12)
        .attr('text-anchor', 'start').attr('font-size', 8).attr('fill', CZ)
        .text('z\u1D57 \u2299 c\u0303\u1D57')
    }

    // ── x_t feeds into reset gate and candidate ────────────
    const Y_XIN = Y_BOT
    svg.append('text').attr('x', X_R - 10).attr('y', Y_XIN)
      .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', textDim).text('x')
    svg.append('text').attr('x', X_R - 5).attr('y', Y_XIN + 3)
      .attr('text-anchor', 'start').attr('font-size', 7).attr('fill', textDim).text('t')

    // x_t → reset gate
    svg.append('line')
      .attr('x1', X_R - 10).attr('y1', Y_XIN - 12)
      .attr('x2', X_R).attr('y2', Y_GATE + BH / 2 + 1)
      .attr('stroke', lineDim).attr('stroke-width', 0.8).attr('stroke-dasharray', '3,3')

    // x_t → candidate (dashed)
    svg.append('line')
      .attr('x1', X_R - 10).attr('y1', Y_XIN - 12)
      .attr('x2', X_C).attr('y2', Y_GATE + BH / 2 + 1)
      .attr('stroke', lineDim).attr('stroke-width', 0.8).attr('stroke-dasharray', '3,3')

    // x_t → update gate (dashed)
    svg.append('line')
      .attr('x1', X_R - 10).attr('y1', Y_XIN - 12)
      .attr('x2', X_Z).attr('y2', Y_GATE + BH / 2 + 1)
      .attr('stroke', lineDim).attr('stroke-width', 0.8).attr('stroke-dasharray', '3,3')

    // ── Step annotation ────────────────────────────────────
    const notes = [
      'GRU has ONE state vector h\u1D57 (no separate cell state) and only 2 gates.',
      'Reset gate r\u1D57: scales h\u1D57\u207B\u00B9 before the candidate \u2014 small r\u1D57 \u2248 ignoring the past.',
      'Candidate c\u0303\u1D57 = tanh(Wc\u00B7[r\u1D57 \u2299 h\u1D57\u207B\u00B9, x\u1D57]) \u2014 proposed new hidden state.',
      'Update gate z\u1D57 interpolates: h\u1D57 = (1\u2212z\u1D57)\u2299h\u1D57\u207B\u00B9 + z\u1D57\u2299c\u0303\u1D57 (no cell state needed).',
    ]
    svg.append('text').attr('x', W / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle').attr('font-size', 9.5).attr('fill', textDim)
      .text(notes[Math.min(step, 3)])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="GRU gate architecture diagram"
    />
  )
}
