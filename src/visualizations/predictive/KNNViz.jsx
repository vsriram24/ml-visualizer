import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'

const W = 480, H = 300, PAD = 36

const POINTS = [
  ...Array.from({ length: 20 }, () => ({ x: Math.random() * 0.5, y: Math.random(), cls: 0 })),
  ...Array.from({ length: 20 }, () => ({ x: 0.5 + Math.random() * 0.5, y: Math.random(), cls: 1 })),
]

function dist(a, b) { return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2) }

export function KNNViz({ resetKey }) {
  const svgRef = useRef(null)
  const [k, setK] = useState(5)
  const [query, setQuery] = useState(null)

  useEffect(() => {
    setQuery(null)
  }, [resetKey])

  useEffect(() => {
    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    const ySc = d3.scaleLinear([0, 1], [H - PAD, PAD])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H-PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    let neighbors = []
    let prediction = -1
    if (query) {
      const sorted = POINTS.map(p => ({ ...p, d: dist(p, query) })).sort((a, b) => a.d - b.d)
      neighbors = sorted.slice(0, k)
      const votes = [0, 0]
      neighbors.forEach(n => votes[n.cls]++)
      prediction = votes[0] > votes[1] ? 0 : 1

      // Radius circle
      const radius = neighbors[k - 1].d
      svg.append('circle')
        .attr('cx', xSc(query.x)).attr('cy', ySc(query.y))
        .attr('r', 0).attr('fill', 'none')
        .attr('stroke', '#f59e0b').attr('stroke-width', 2).attr('stroke-dasharray', '5,3')
        .transition().duration(400).attr('r', xSc(query.x + radius) - xSc(query.x))

      // Lines to neighbors
      neighbors.forEach(n => {
        svg.append('line')
          .attr('x1', xSc(query.x)).attr('y1', ySc(query.y))
          .attr('x2', xSc(n.x)).attr('y2', ySc(n.y))
          .attr('stroke', '#f59e0b').attr('stroke-width', 1.5).attr('opacity', 0.7)
      })
    }

    // Data points
    POINTS.forEach((p, i) => {
      const isNeighbor = neighbors.some(n => n === p)
      svg.append('circle')
        .attr('cx', xSc(p.x)).attr('cy', ySc(p.y)).attr('r', isNeighbor ? 8 : 6)
        .attr('fill', p.cls === 0 ? '#06b6d4' : '#f43f5e')
        .attr('stroke', isNeighbor ? '#f59e0b' : 'white').attr('stroke-width', isNeighbor ? 2.5 : 1.5)
        .attr('opacity', 0.9)
    })

    // Query point
    if (query) {
      svg.append('circle')
        .attr('cx', xSc(query.x)).attr('cy', ySc(query.y)).attr('r', 10)
        .attr('fill', prediction === 0 ? '#06b6d4' : '#f43f5e')
        .attr('stroke', '#f59e0b').attr('stroke-width', 3)
        .attr('opacity', 0.95)
      svg.append('text').attr('x', xSc(query.x) + 14).attr('y', ySc(query.y) + 4)
        .attr('font-size', 11).attr('fill', '#f59e0b').attr('font-weight', 600)
        .text(`→ Class ${prediction}`)
    }

    // Click to query
    svg.on('click', function(event) {
      const [mx, my] = d3.pointer(event)
      setQuery({ x: xSc.invert(mx), y: ySc.invert(my) })
    })
  }, [k, query, resetKey])

  return (
    <div>
      <div className="px-4 pt-3 pb-1 flex items-center gap-6">
        <div className="w-48">
          <Slider label="K neighbors" value={k} min={1} max={15} step={1} onChange={v => setK(Math.round(v))} />
        </div>
        <span className="text-xs text-slate-400">Click anywhere to classify a point</span>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg cursor-crosshair"
        aria-label="K-nearest neighbors visualization"
      />
    </div>
  )
}
