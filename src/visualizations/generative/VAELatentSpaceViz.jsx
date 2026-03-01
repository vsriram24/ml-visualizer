import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 300
const N_CLASSES = 5
const LABELS = ['Circle', 'Square', 'Star', 'Triangle', 'Cross']
const COLORS = d3.schemeTableau10

// Generate fake latent space clusters
function generateLatentPoints() {
  const centers = [
    [-1.8, 0.8], [1.8, 0.8], [0, -1.8], [-1.5, -1.2], [1.5, -1.2]
  ]
  return centers.flatMap((c, ci) =>
    Array.from({ length: 40 }, () => ({
      x: c[0] + d3.randomNormal(0, 0.35)(),
      y: c[1] + d3.randomNormal(0, 0.35)(),
      cls: ci,
    }))
  )
}

const POINTS = generateLatentPoints()

export function VAELatentSpaceViz({ resetKey }) {
  const svgRef = useRef(null)
  const [beta, setBeta] = useState(1)
  const [hovered, setHovered] = useState(null)
  const { dark } = useTheme()

  useEffect(() => {
    const domain = 3
    const spread = 1 + (beta - 1) * 0.15  // higher beta → more compressed

    const xSc = d3.scaleLinear([-domain, domain], [50, W - 50])
    const ySc = d3.scaleLinear([-domain, domain], [H - 40, 40])

    const betaFill = dark ? '#94a3b8' : '#64748b'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Axes
    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${ySc(0)})`).call(d3.axisBottom(xSc).ticks(6))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${xSc(0)},0)`).call(d3.axisLeft(ySc).ticks(6))

    // Axis labels
    svg.append('text').attr('x', W - 20).attr('y', ySc(0) + 14).attr('font-size', 10).attr('fill', '#94a3b8').text('z₁')
    svg.append('text').attr('x', xSc(0) + 6).attr('y', 14).attr('font-size', 10).attr('fill', '#94a3b8').text('z₂')

    // Unit Gaussian circle (KL penalty target)
    const gaussR = beta > 1.5 ? xSc(0.8) - xSc(0) : xSc(1.5) - xSc(0)
    svg.append('ellipse')
      .attr('cx', xSc(0)).attr('cy', ySc(0))
      .attr('rx', gaussR).attr('ry', gaussR * (H - 80) / (W - 100))
      .attr('fill', 'none').attr('stroke', '#6366f1').attr('stroke-width', 1.5)
      .attr('stroke-dasharray', '4,4').attr('opacity', 0.4)
    svg.append('text').attr('x', xSc(0) + gaussR + 4).attr('y', ySc(0) - 8)
      .attr('font-size', 9).attr('fill', '#6366f1').attr('opacity', 0.6).text('N(0,I) prior')

    // Latent points (compressed by beta)
    POINTS.forEach((p, idx) => {
      const px = xSc(p.x / spread), py = ySc(p.y / spread)
      svg.append('circle')
        .attr('cx', px).attr('cy', py).attr('r', 5)
        .attr('fill', COLORS[p.cls]).attr('opacity', 0.8)
        .attr('stroke', hovered === p.cls ? 'white' : 'transparent').attr('stroke-width', 1.5)
        .attr('cursor', 'pointer')
        .on('mouseover', () => setHovered(p.cls))
        .on('mouseout', () => setHovered(null))
    })

    // Class labels
    const centers = LABELS.map((_, ci) => {
      const clsPts = POINTS.filter(p => p.cls === ci)
      return {
        x: xSc(d3.mean(clsPts, p => p.x / spread)),
        y: ySc(d3.mean(clsPts, p => p.y / spread)),
        label: LABELS[ci],
        cls: ci,
      }
    })

    centers.forEach(c => {
      svg.append('text').attr('x', c.x).attr('y', c.y - 10)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('font-weight', 600)
        .attr('fill', COLORS[c.cls])
        .text(c.label)
    })

    // Beta label
    svg.append('text').attr('x', W - 12).attr('y', 16).attr('text-anchor', 'end')
      .attr('font-size', 10).attr('fill', betaFill).text(`β = ${beta}`)

  }, [beta, hovered, resetKey, dark])

  return (
    <div>
      <div className="px-4 pt-3 pb-1 w-56">
        <Slider label="β (KL weight)" value={beta} min={0.5} max={4} step={0.5} onChange={setBeta} />
      </div>
      <p className="px-4 text-xs text-slate-400 dark:text-slate-500 mb-1">
        Higher β compresses clusters toward the N(0,I) prior (purple circle). Hover points to highlight a class.
      </p>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="VAE latent space visualization"
      />
    </div>
  )
}
