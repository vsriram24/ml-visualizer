import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const ARCH = [2, 4, 4, 1]
const W = 480, H = 300

const lcg = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }

function sigmoid(z) { return 1 / (1 + Math.exp(-z)) }

function buildWeights() {
  const r = lcg(42)
  const weights = []
  for (let l = 0; l < ARCH.length - 1; l++) {
    for (let i = 0; i < ARCH[l]; i++) {
      for (let j = 0; j < ARCH[l + 1]; j++) {
        weights.push({ from: `${l}-${i}`, to: `${l+1}-${j}`, w: (r() - 0.5) * 2 })
      }
    }
  }
  return weights
}

function computeForwardPass(seed, weights) {
  const r = lcg(seed)
  const input = [r() * 2 - 1, r() * 2 - 1]
  const acts = [input]
  for (let l = 1; l < ARCH.length; l++) {
    const prev = acts[l - 1]
    acts.push(Array.from({ length: ARCH[l] }, (_, j) => {
      const z = weights
        .filter(w => w.to === `${l}-${j}`)
        .reduce((sum, { from, w }) => sum + w * prev[parseInt(from.split('-')[1])], 0)
      return sigmoid(z)
    }))
  }
  return acts
}

function getNodePositions(arch, w, h, pad = 40) {
  const positions = []
  arch.forEach((count, layer) => {
    const x = pad + (layer / (arch.length - 1)) * (w - 2 * pad)
    for (let i = 0; i < count; i++) {
      const y = (h / 2) - ((count - 1) / 2) * 56 + i * 56
      positions.push({ layer, i, x, y, id: `${layer}-${i}` })
    }
  })
  return positions
}

const WEIGHTS = buildWeights()
const NODES = getNodePositions(ARCH, W, H)
const NODE_MAP = Object.fromEntries(NODES.map(n => [n.id, n]))

export const NEURAL_NET_STEPS = 8

export function NeuralNetViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const inactiveFill = dark ? '#1e293b' : '#f1f5f9'
    const nodeTextFill = dark ? '#94a3b8' : '#475569'
    const textSec      = dark ? '#94a3b8' : '#64748b'
    const layerLabel   = dark ? '#64748b' : '#94a3b8'

    const passIdx = Math.floor(step / ARCH.length)
    const activeLayer = step % ARCH.length

    const acts = computeForwardPass(passIdx + 1, WEIGHTS)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    ;['Input', 'Hidden 1', 'Hidden 2', 'Output'].forEach((label, l) => {
      const lx = 40 + (l / (ARCH.length - 1)) * (W - 80)
      svg.append('text').attr('x', lx).attr('y', H - 14).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', layerLabel).text(label)
    })

    WEIGHTS.forEach(({ from, to, w }) => {
      const fn = NODE_MAP[from], tn = NODE_MAP[to]
      const fromLayer = parseInt(from.split('-')[0])
      const isActive = fromLayer <= activeLayer
      svg.append('line')
        .attr('x1', fn.x).attr('y1', fn.y).attr('x2', tn.x).attr('y2', tn.y)
        .attr('stroke', w > 0 ? '#6366f1' : '#f43f5e')
        .attr('stroke-width', Math.abs(w) * 1.2 + 0.3)
        .attr('opacity', isActive ? 0.3 + Math.abs(w) * 0.4 : 0.12)
    })

    NODES.forEach(n => {
      const isActive = n.layer <= activeLayer
      const act = isActive ? acts[n.layer][n.i] : null
      const g = svg.append('g').attr('transform', `translate(${n.x},${n.y})`)
      g.append('circle')
        .attr('r', 18)
        .attr('fill', isActive ? d3.interpolateYlOrRd(Math.abs(act)) : inactiveFill)
        .attr('stroke', n.layer === activeLayer ? '#f59e0b' : '#6366f1')
        .attr('stroke-width', n.layer === activeLayer ? 2.5 : 1.5)
      g.append('text').attr('y', 4).attr('text-anchor', 'middle').attr('font-size', 9).attr('fill', nodeTextFill)
        .text(n.layer === 0 ? `x${n.i + 1}` : n.layer === ARCH.length - 1 ? 'ŷ' : 'a')
      if (isActive && n.layer === activeLayer) {
        g.append('text').attr('y', 32).attr('text-anchor', 'middle').attr('font-size', 8).attr('fill', textSec)
          .text(act.toFixed(2))
      }
    })

    svg.append('text').attr('x', W - 12).attr('y', 16).attr('text-anchor', 'end')
      .attr('font-size', 10).attr('fill', textSec)
      .text(`Pass ${passIdx + 1}, Layer ${activeLayer + 1}`)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="Neural network forward pass visualization"
    />
  )
}
