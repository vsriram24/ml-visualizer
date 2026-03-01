import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

const W = 480, H = 280, PAD = 40

function computeLine(pts) {
  if (pts.length < 2) return { m: 0, b: 0.5, loss: 0 }
  const n = pts.length
  const mx = d3.mean(pts, p => p.x), my = d3.mean(pts, p => p.y)
  const num = d3.sum(pts, p => (p.x - mx) * (p.y - my))
  const den = d3.sum(pts, p => (p.x - mx) ** 2)
  const m = den === 0 ? 0 : num / den
  const b = my - m * mx
  const loss = d3.mean(pts, p => (p.y - (m * p.x + b)) ** 2)
  return { m, b, loss }
}

const INIT_POINTS = [
  { x: 0.1, y: 0.2 }, { x: 0.2, y: 0.35 }, { x: 0.3, y: 0.4 },
  { x: 0.4, y: 0.5 }, { x: 0.5, y: 0.55 }, { x: 0.6, y: 0.65 },
  { x: 0.7, y: 0.7 }, { x: 0.8, y: 0.78 }, { x: 0.9, y: 0.88 },
  { x: 0.15, y: 0.28 }, { x: 0.45, y: 0.48 }, { x: 0.75, y: 0.72 },
]

export function LinearRegressionViz({ resetKey }) {
  const svgRef = useRef(null)
  const [pts, setPts] = useState(INIT_POINTS)
  const [loss, setLoss] = useState(0)

  useEffect(() => { setPts(INIT_POINTS) }, [resetKey])

  useEffect(() => {
    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    const ySc = d3.scaleLinear([0, 1], [H - PAD, PAD])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H-PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    const { m, b, loss: lval } = computeLine(pts)
    setLoss(lval)

    // Residual lines
    const residuals = svg.append('g')
    pts.forEach(p => {
      const pred = m * p.x + b
      residuals.append('line')
        .attr('x1', xSc(p.x)).attr('y1', ySc(p.y))
        .attr('x2', xSc(p.x)).attr('y2', ySc(pred))
        .attr('stroke', '#f43f5e').attr('stroke-width', 1.5).attr('opacity', 0.5)
    })

    // Regression line
    if (pts.length >= 2) {
      svg.append('line')
        .attr('x1', xSc(0)).attr('y1', ySc(b))
        .attr('x2', xSc(1)).attr('y2', ySc(m + b))
        .attr('stroke', '#6366f1').attr('stroke-width', 2.5)
        .attr('stroke-linecap', 'round')
        .transition().duration(300)
    }

    // Data points (draggable)
    svg.selectAll('circle.point')
      .data(pts, (_, i) => i)
      .join('circle')
      .attr('class', 'point')
      .attr('cx', p => xSc(p.x)).attr('cy', p => ySc(p.y))
      .attr('r', 6).attr('fill', '#06b6d4').attr('stroke', 'white').attr('stroke-width', 1.5)
      .attr('cursor', 'grab').attr('opacity', 0.9)
      .call(
        d3.drag()
          .on('drag', function(event, d) {
            const nx = Math.max(0, Math.min(1, xSc.invert(event.x)))
            const ny = Math.max(0, Math.min(1, ySc.invert(event.y)))
            setPts(prev => prev.map(p => p === d ? { x: nx, y: ny } : p))
          })
      )

    // Click to add point
    svg.on('click', function(event) {
      if (event.target.tagName === 'circle') return
      const [mx2, my2] = d3.pointer(event)
      const nx = xSc.invert(mx2), ny = ySc.invert(my2)
      if (nx < 0 || nx > 1 || ny < 0 || ny > 1) return
      setPts(prev => [...prev, { x: nx, y: ny }])
    })
  }, [pts])

  return (
    <div>
      <div className="flex items-center gap-4 px-4 pt-2">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          MSE Loss: <strong className="font-mono text-rose-600 dark:text-rose-400">{loss.toFixed(4)}</strong>
        </span>
        <span className="text-xs text-slate-400">Drag points or click to add</span>
        <span className="flex items-center gap-1 text-xs ml-auto">
          <span className="w-3 h-0.5 bg-brand-500 inline-block" /> Regression line
          <span className="w-3 h-0.5 bg-rose-500 inline-block ml-2" /> Residuals
        </span>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg cursor-crosshair"
        aria-label="Linear regression scatter plot"
      />
    </div>
  )
}
