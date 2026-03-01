import { useEffect, useRef, useState, useMemo } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'
import { useTheme } from '../../context/ThemeContext'

export const UNSUPERVISED_STEPS = 10

const W = 480, H = 300, PAD = 36
const COLOR_SCALE = d3.schemeTableau10

const rng = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }

function generateData(k, seed = 99) {
  const r = rng(seed)
  const clusters = Array.from({ length: k }, (_, i) => ({
    cx: 0.15 + (i / Math.max(k - 1, 1)) * 0.7 + (r() - 0.5) * 0.12,
    cy: 0.2 + r() * 0.6,
  }))
  const pts = []
  clusters.forEach((c, ci) => {
    for (let i = 0; i < 20; i++) {
      pts.push({ x: Math.max(0.02, Math.min(0.98, c.cx + (r() - 0.5) * 0.18)),
                 y: Math.max(0.02, Math.min(0.98, c.cy + (r() - 0.5) * 0.18)), trueCluster: ci })
    }
  })
  return { pts, clusters }
}

function dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) }

function kmeansAt(pts, k, iterations, seed = 7) {
  const r = rng(seed)
  let centroids = Array.from({ length: k }, () => ({ x: r(), y: r() }))
  let assigned = pts.map(p => ({ ...p, cluster: 0 }))

  for (let it = 0; it < iterations; it++) {
    assigned = assigned.map(p => ({ ...p, cluster: d3.minIndex(centroids, c => dist(p, c)) }))
    centroids = Array.from({ length: k }, (_, ci) => {
      const members = assigned.filter(p => p.cluster === ci)
      if (!members.length) return { x: r(), y: r() }
      return { x: d3.mean(members, p => p.x), y: d3.mean(members, p => p.y) }
    })
  }
  return { assigned, centroids }
}

export function UnsupervisedViz({ step = 0, resetKey }) {
  const [k, setK] = useState(3)
  const { dark } = useTheme()

  const { pts } = useMemo(() => generateData(k), [k, resetKey])
  const { assigned, centroids } = useMemo(() => kmeansAt(pts, k, step), [pts, k, step])

  const svgRef = useRef(null)

  useEffect(() => {
    const textSec = dark ? '#94a3b8' : '#64748b'

    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    const ySc = d3.scaleLinear([0, 1], [H - PAD, PAD])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H - PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    assigned.forEach(p => {
      svg.append('circle').attr('cx', xSc(p.x)).attr('cy', ySc(p.y)).attr('r', 5)
        .attr('fill', p.cluster >= 0 ? COLOR_SCALE[p.cluster % 10] : '#94a3b8').attr('opacity', 0.8)
    })

    centroids.forEach((c, ci) => {
      svg.append('text').attr('x', xSc(c.x)).attr('y', ySc(c.y) + 6)
        .attr('text-anchor', 'middle').attr('font-size', 22)
        .attr('fill', COLOR_SCALE[ci % 10]).attr('font-weight', 700).text('✕')
    })

    svg.append('text').attr('x', W - PAD - 2).attr('y', PAD + 14).attr('text-anchor', 'end')
      .attr('font-size', 11).attr('fill', textSec)
      .text(step === 0 ? 'Initial (random centroids)' : `Iteration ${step}`)
  }, [assigned, centroids, step, dark])

  return (
    <div>
      <div className="px-4 pt-3 pb-1 w-52">
        <Slider label="Number of clusters K" value={k} min={2} max={6} step={1} onChange={v => setK(Math.round(v))} />
      </div>
      <svg ref={svgRef} width={W} height={H} viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg" aria-label="K-means clustering" />
    </div>
  )
}
