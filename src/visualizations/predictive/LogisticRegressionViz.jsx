import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 300, PAD = 40

// Seeded LCG for deterministic points
const lcg = (seed) => { let s = seed; return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 } }
const rng = lcg(42)

const POINTS = [
  ...Array.from({ length: 15 }, (_, i) => ({ x: 0.08 + i * 0.04 + (rng() - 0.5) * 0.03, y: 0.5 + rng() * 0.4, cls: 0 })),
  ...Array.from({ length: 15 }, (_, i) => ({ x: 0.50 + i * 0.03 + (rng() - 0.5) * 0.03, y: 0.1 + rng() * 0.4, cls: 1 })),
]

// Each step: boundary x position + slope (sharpness) as gradient descent converges
const STEPS = [
  { boundary: 0.10, slope: 2  },
  { boundary: 0.20, slope: 3  },
  { boundary: 0.28, slope: 5  },
  { boundary: 0.34, slope: 7  },
  { boundary: 0.38, slope: 9  },
  { boundary: 0.40, slope: 10 },
  { boundary: 0.415, slope: 11 },
  { boundary: 0.42, slope: 12 },
]

export const LOGISTIC_STEPS = STEPS.length

function sigmoid(z) { return 1 / (1 + Math.exp(-z)) }

export function LogisticRegressionViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const { boundary, slope } = STEPS[Math.min(step, STEPS.length - 1)]

    const legendText   = dark ? '#94a3b8' : '#64748b'
    const legendBg     = dark ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.9)'
    const legendStroke = dark ? '#334155' : '#e2e8f0'

    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    // Top at 60 gives more breathing room above the legend items
    const TOP = 60
    const ySc = d3.scaleLinear([0, 1], [H - PAD, TOP])
    const plotH = H - PAD - TOP  // actual pixel height of the plot area

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H - PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    // Background probability gradient
    const res = 30
    const colorScale = d3.scaleSequential(d3.interpolateRdYlBu).domain([1, 0])
    for (let ci = 0; ci <= res; ci++) {
      for (let ri = 0; ri <= res; ri++) {
        const xv = ci / res, yv = ri / res
        const prob = sigmoid((xv - boundary) * slope)
        svg.append('rect')
          .attr('x', xSc(xv) - (W - 2 * PAD) / res / 2)
          .attr('y', ySc(yv) - plotH / res / 2)
          .attr('width', (W - 2 * PAD) / res + 1)
          .attr('height', plotH / res + 1)
          .attr('fill', colorScale(prob))
          .attr('opacity', 0.25)
      }
    }

    // Decision boundary line
    svg.append('line')
      .attr('x1', xSc(boundary)).attr('y1', ySc(0))
      .attr('x2', xSc(boundary)).attr('y2', ySc(1))
      .attr('stroke', '#6366f1').attr('stroke-width', 2)
      .attr('stroke-dasharray', '6,3')

    const isConverged = step >= STEPS.length - 1
    svg.append('text')
      .attr('x', xSc(boundary) + 4).attr('y', ySc(0.88))
      .attr('font-size', 10).attr('fill', '#6366f1')
      .text(isConverged ? 'Decision boundary' : `Epoch ${step + 1}`)

    // Points
    POINTS.forEach(p => {
      svg.append('circle')
        .attr('cx', xSc(p.x)).attr('cy', ySc(p.y))
        .attr('r', 6)
        .attr('fill', p.cls === 0 ? '#06b6d4' : '#f43f5e')
        .attr('stroke', 'white').attr('stroke-width', 1.5)
        .attr('opacity', 0.9)
    })

    // Legend with background
    const leg = svg.append('g').attr('transform', 'translate(12, 12)')
    leg.append('rect').attr('x', -4).attr('y', -10).attr('width', 82).attr('height', 44).attr('rx', 4)
      .attr('fill', legendBg).attr('stroke', legendStroke).attr('stroke-width', 1)
    ;[['#06b6d4', 'Class 0'], ['#f43f5e', 'Class 1']].forEach(([c, label], i) => {
      const row = leg.append('g').attr('transform', `translate(0, ${i * 18})`)
      row.append('circle').attr('r', 5).attr('cx', 5).attr('cy', 0).attr('fill', c)
      row.append('text').attr('x', 14).attr('y', 4).attr('font-size', 11).attr('fill', legendText).text(label)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="Logistic regression decision boundary"
    />
  )
}
