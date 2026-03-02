import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 520, H = 295

export const LSTM_STEPS = 5

// step 0 = structure visible (dim)
// step 1 = forget gate fires  → erases cell state
// step 2 = input + candidate  → writes new info to cell state
// step 3 = cell state c_t updated
// step 4 = output gate        → produces h_t

export function LSTMGateViz({ step = 0, resetKey }) {
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
    const CF = '#ef4444'   // forget  – red
    const CI = '#3b82f6'   // input   – blue
    const CC = '#06b6d4'   // candidate – cyan
    const CO = '#8b5cf6'   // output  – violet
    const CL = '#f59e0b'   // cell state – amber

    // Layout
    const CY = 82    // cell state line y
    const GY = 172   // gate box center y
    const IY = 248   // input label y

    // Cell highway x positions
    const X_CL  = 52    // cell line start (left)
    const X_FOX = 155   // forget ⊗ center x
    const X_AOX = 305   // add ⊕ center x
    const X_CR  = 455   // cell line end (c_t)

    // Gate box centers (x)
    const XF = 98    // forget gate
    const XI = 200   // input gate
    const XC = 302   // candidate gate
    const XO = 408   // output gate

    const OP_R = 13  // operation circle radius
    const BW = 78, BH = 42  // gate box dimensions

    // ── Arrow markers ──────────────────────────────────────
    const defs = svg.append('defs')
    const mkArrow = (id, color) =>
      defs.append('marker').attr('id', id)
        .attr('markerWidth', 6).attr('markerHeight', 6)
        .attr('refX', 6).attr('refY', 3).attr('orient', 'auto')
        .append('path').attr('d', 'M0,0 L6,3 L0,6 Z').attr('fill', color)

    mkArrow('lf', step >= 1 ? CF : lineDim)
    mkArrow('li', step >= 2 ? CI : lineDim)
    mkArrow('lc', step >= 2 ? CC : lineDim)
    mkArrow('lo', step >= 4 ? CO : lineDim)

    // ── Title ──────────────────────────────────────────────
    svg.append('text').attr('x', W / 2).attr('y', 22)
      .attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 600)
      .attr('fill', textFg).text('LSTM Cell — Gate Operations')

    // ── Cell state highway (dashed amber line) ─────────────
    const cellColor = step >= 3 ? CL : lineDim

    // Left segment: start → ⊗
    svg.append('line')
      .attr('x1', X_CL).attr('y1', CY).attr('x2', X_FOX - OP_R - 1).attr('y2', CY)
      .attr('stroke', step >= 1 ? CL : lineDim).attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
    // Middle segment: ⊗ → ⊕
    svg.append('line')
      .attr('x1', X_FOX + OP_R + 1).attr('y1', CY).attr('x2', X_AOX - OP_R - 1).attr('y2', CY)
      .attr('stroke', step >= 2 ? CL : lineDim).attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')
    // Right segment: ⊕ → c_t
    svg.append('line')
      .attr('x1', X_AOX + OP_R + 1).attr('y1', CY).attr('x2', X_CR - 5).attr('y2', CY)
      .attr('stroke', cellColor).attr('stroke-width', 2)
      .attr('stroke-dasharray', '5,3')

    // c_{t-1} label
    svg.append('text').attr('x', X_CL - 14).attr('y', CY + 4).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 700)
      .attr('fill', step >= 1 ? CL : textDim).text('c')
    svg.append('text').attr('x', X_CL - 4).attr('y', CY + 9).attr('text-anchor', 'start')
      .attr('font-size', 8).attr('fill', step >= 1 ? CL : textDim).text('t-1')

    // c_t label
    svg.append('text').attr('x', X_CR + 11).attr('y', CY + 4).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 700)
      .attr('fill', step >= 3 ? CL : textDim).text('c')
    svg.append('text').attr('x', X_CR + 17).attr('y', CY + 9).attr('text-anchor', 'start')
      .attr('font-size', 8).attr('fill', step >= 3 ? CL : textDim).text('t')

    // ── Operation circles on cell line ─────────────────────
    // ⊗ (forget multiply)
    {
      const ac = step >= 1
      svg.append('circle').attr('cx', X_FOX).attr('cy', CY).attr('r', OP_R)
        .attr('fill', cardBg).attr('stroke', ac ? CF : lineDim).attr('stroke-width', 2)
      svg.append('text').attr('x', X_FOX).attr('y', CY + 5).attr('text-anchor', 'middle')
        .attr('font-size', 14).attr('fill', ac ? CF : textDim).text('×')
    }
    // ⊕ (add)
    {
      const ac = step >= 2
      svg.append('circle').attr('cx', X_AOX).attr('cy', CY).attr('r', OP_R)
        .attr('fill', cardBg).attr('stroke', ac ? CI : lineDim).attr('stroke-width', 2)
      svg.append('text').attr('x', X_AOX).attr('y', CY + 5).attr('text-anchor', 'middle')
        .attr('font-size', 14).attr('fill', ac ? CI : textDim).text('+')
    }

    // ── Gate box helper ────────────────────────────────────
    const gateBox = (cx, title, sub, color, active) => {
      svg.append('rect')
        .attr('x', cx - BW / 2).attr('y', GY - BH / 2)
        .attr('width', BW).attr('height', BH).attr('rx', 7)
        .attr('fill', active ? `${color}18` : cardBg)
        .attr('stroke', active ? color : lineDim)
        .attr('stroke-width', active ? 2 : 1)
      svg.append('text').attr('x', cx).attr('y', GY - 7).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('font-weight', 700)
        .attr('fill', active ? color : textDim).text(title)
      svg.append('text').attr('x', cx).attr('y', GY + 9).attr('text-anchor', 'middle')
        .attr('font-size', 8.5).attr('fill', active ? `${color}cc` : textDim).text(sub)
    }

    gateBox(XF, 'Forget Gate',  'f = σ(Wf·[h,x])',  CF, step >= 1)
    gateBox(XI, 'Input Gate',   'i = σ(Wi·[h,x])',  CI, step >= 2)
    gateBox(XC, 'Candidate',    'c̃ = tanh(Wc·[h,x])', CC, step >= 2)
    gateBox(XO, 'Output Gate',  'o = σ(Wo·[h,x])',  CO, step >= 4)

    // ── Gate → cell state connection lines ─────────────────
    // Forget gate → ⊗
    svg.append('line')
      .attr('x1', XF).attr('y1', GY - BH / 2 - 1)
      .attr('x2', X_FOX).attr('y2', CY + OP_R + 1)
      .attr('stroke', step >= 1 ? CF : lineDim)
      .attr('stroke-width', step >= 1 ? 1.5 : 1)
      .attr('marker-end', 'url(#lf)')

    // Input gate → ⊕ (left side)
    svg.append('line')
      .attr('x1', XI).attr('y1', GY - BH / 2 - 1)
      .attr('x2', X_AOX - 6).attr('y2', CY + OP_R + 1)
      .attr('stroke', step >= 2 ? CI : lineDim)
      .attr('stroke-width', step >= 2 ? 1.5 : 1)
      .attr('marker-end', 'url(#li)')

    // Candidate → ⊕ (right side)
    svg.append('line')
      .attr('x1', XC).attr('y1', GY - BH / 2 - 1)
      .attr('x2', X_AOX + 6).attr('y2', CY + OP_R + 1)
      .attr('stroke', step >= 2 ? CC : lineDim)
      .attr('stroke-width', step >= 2 ? 1.5 : 1)
      .attr('marker-end', 'url(#lc)')

    // c_t dotted stub downward (shows it feeds output gate)
    svg.append('line')
      .attr('x1', X_CR).attr('y1', CY + 2)
      .attr('x2', X_CR).attr('y2', GY - BH / 2 - 1)
      .attr('stroke', step >= 4 ? CO : lineDim)
      .attr('stroke-width', 1)
      .attr('stroke-dasharray', '3,3')

    // Output gate → h_t
    svg.append('line')
      .attr('x1', XO + BW / 2 + 1).attr('y1', GY)
      .attr('x2', W - 22).attr('y2', GY)
      .attr('stroke', step >= 4 ? CO : lineDim)
      .attr('stroke-width', step >= 4 ? 1.5 : 1)
      .attr('marker-end', 'url(#lo)')

    // Label "⊙ tanh(ct)" on output arrow when active
    if (step >= 4) {
      svg.append('text').attr('x', XO + BW / 2 + 22).attr('y', GY - 7)
        .attr('font-size', 8.5).attr('fill', CO).text('⊙ tanh(c')
      svg.append('text').attr('x', XO + BW / 2 + 64).attr('y', GY - 3)
        .attr('font-size', 7).attr('fill', CO).text('t')
      svg.append('text').attr('x', XO + BW / 2 + 69).attr('y', GY - 7)
        .attr('font-size', 8.5).attr('fill', CO).text(')')
    }

    // h_t label
    svg.append('text').attr('x', W - 12).attr('y', GY + 4).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 700)
      .attr('fill', step >= 4 ? CO : textDim).text('h')
    svg.append('text').attr('x', W - 5).attr('y', GY + 8).attr('text-anchor', 'start')
      .attr('font-size', 8).attr('fill', step >= 4 ? CO : textDim).text('t')

    // ── Input labels & fan lines ───────────────────────────
    const X_HIN = 58, X_XIN = 115

    svg.append('text').attr('x', X_HIN).attr('y', IY).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', textDim).text('h')
    svg.append('text').attr('x', X_HIN + 5).attr('y', IY + 3).attr('text-anchor', 'start')
      .attr('font-size', 7).attr('fill', textDim).text('t-1')

    svg.append('text').attr('x', X_XIN).attr('y', IY).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', textDim).text('x')
    svg.append('text').attr('x', X_XIN + 5).attr('y', IY + 3).attr('text-anchor', 'start')
      .attr('font-size', 7).attr('fill', textDim).text('t')

    ;[XF, XI, XC, XO].forEach(gx => {
      ;[X_HIN, X_XIN].forEach(ix => {
        svg.append('line')
          .attr('x1', ix).attr('y1', IY - 13)
          .attr('x2', gx).attr('y2', GY + BH / 2 + 1)
          .attr('stroke', lineDim).attr('stroke-width', 0.8)
          .attr('stroke-dasharray', '3,3')
      })
    })

    // ── Step annotation ────────────────────────────────────
    const notes = [
      'All 4 gates read both h\u1D57\u207B\u00B9 and x\u1D57 as inputs.',
      'Forget gate (red): selectively erases parts of the cell state c\u1D57\u207B\u00B9.',
      'Input + Candidate (blue/cyan): compute new information to write into the cell.',
      'Cell state c\u1D57 updated: c\u1D57 = f\u1D57 \u2299 c\u1D57\u207B\u00B9 + i\u1D57 \u2299 c\u0303\u1D57',
      'Output gate (violet): exposes h\u1D57 = o\u1D57 \u2299 tanh(c\u1D57) to the next layer.',
    ]
    svg.append('text').attr('x', W / 2).attr('y', H - 8)
      .attr('text-anchor', 'middle').attr('font-size', 9.5).attr('fill', textDim)
      .text(notes[Math.min(step, 4)])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="LSTM gate architecture diagram"
    />
  )
}
