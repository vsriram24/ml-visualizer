import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 320

// Seeded LCG for deterministic sampling
const lcg = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }

function sampleReal(seed) {
  const r = lcg(seed)
  return Array.from({ length: 80 }, () => {
    const c = r() < 0.5
    const cx = c ? -0.5 : 0.5, cy = c ? 0.3 : -0.3
    const nx = r() + r() - 1  // box-muller-ish
    const ny = r() + r() - 1
    return { x: cx + nx * 0.18, y: cy + ny * 0.18 }
  })
}

function sampleGen(epoch, seed) {
  const r = lcg(seed + epoch * 1337)
  const t = Math.min(epoch / (GAN_STEPS - 1), 1)
  return Array.from({ length: 80 }, () => {
    const noisex = (r() - 0.5) * 2, noisey = (r() - 0.5) * 2
    const c = r() < 0.5
    const cx = c ? -0.5 : 0.5, cy = c ? 0.3 : -0.3
    const tx = cx + (r() + r() - 1) * 0.18
    const ty = cy + (r() + r() - 1) * 0.18
    return { x: noisex * (1 - t) + tx * t, y: noisey * (1 - t) + ty * t }
  })
}

function getLossAt(epoch) {
  const r = lcg(epoch * 7919 + 13)
  const t = Math.min(epoch / (GAN_STEPS - 1), 1)
  return {
    G: 0.7 - 0.3 * t + (r() - 0.5) * 0.1,
    D: 0.7 - 0.2 * t + (r() - 0.5) * 0.08,
  }
}

export const GAN_STEPS = 80  // loops=true

const DOMAIN = [-1.4, 1.4]
const REAL_PTS = sampleReal(42)

export function GANTrainingViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const epoch = step
    const xSc = d3.scaleLinear(DOMAIN, [40, W / 2 - 20])
    const ySc = d3.scaleLinear(DOMAIN, [H - 60, 40])

    const panelBg     = dark ? '#0f172a' : '#f8fafc'
    const panelStroke = dark ? '#334155' : '#e2e8f0'
    const headerFill  = dark ? '#94a3b8' : '#475569'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Panel backgrounds
    ;[0, W / 2].forEach(ox => {
      svg.append('rect').attr('x', ox + 2).attr('y', 24).attr('width', W / 2 - 4).attr('height', H - 80)
        .attr('rx', 8).attr('fill', panelBg).attr('stroke', panelStroke)
    })

    svg.append('text').attr('x', W / 4).attr('y', 16).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 600).attr('fill', headerFill).text('Real Data')
    svg.append('text').attr('x', (3 * W) / 4).attr('y', 16).attr('text-anchor', 'middle')
      .attr('font-size', 11).attr('font-weight', 600).attr('fill', headerFill)
      .text(`Generator (epoch ${epoch})`)

    // Real data points (fixed)
    REAL_PTS.forEach(p => {
      svg.append('circle').attr('cx', xSc(p.x)).attr('cy', ySc(p.y)).attr('r', 3.5)
        .attr('fill', '#10b981').attr('opacity', 0.7)
    })

    // Generated points (evolve with epoch)
    sampleGen(epoch, 99).forEach(p => {
      svg.append('circle').attr('cx', W / 2 + xSc(p.x) - 40).attr('cy', ySc(p.y)).attr('r', 3.5)
        .attr('fill', '#f43f5e').attr('opacity', 0.7)
    })

    // Loss history up to current epoch
    const lossHistory = Array.from({ length: Math.min(epoch + 1, 60) }, (_, i) => {
      const ep = Math.max(0, epoch - 59 + i)
      return getLossAt(ep)
    })

    if (lossHistory.length > 2) {
      const n = lossHistory.length
      const lxSc = d3.scaleLinear([0, n - 1], [24, W - 24])
      const lySc = d3.scaleLinear([0, 1], [H - 8, H - 55])
      const lossLine = d3.line().x((_, i) => lxSc(i)).y(d => lySc(d)).curve(d3.curveCatmullRom)

      svg.append('path').datum(lossHistory.map(l => l.G)).attr('fill', 'none')
        .attr('stroke', '#f43f5e').attr('stroke-width', 1.5).attr('d', lossLine)
      svg.append('path').datum(lossHistory.map(l => l.D)).attr('fill', 'none')
        .attr('stroke', '#6366f1').attr('stroke-width', 1.5).attr('d', lossLine)

      svg.append('text').attr('x', W - 28).attr('y', H - 42).attr('font-size', 9).attr('fill', '#f43f5e').text('G loss')
      svg.append('text').attr('x', W - 28).attr('y', H - 30).attr('font-size', 9).attr('fill', '#6366f1').text('D loss')
      svg.append('text').attr('x', W / 2).attr('y', H - 42)
        .attr('font-size', 9).attr('text-anchor', 'middle').attr('fill', '#94a3b8').text('Training progress →')
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="GAN training visualization"
    />
  )
}
