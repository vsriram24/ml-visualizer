import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import { Slider } from '../../components/ui/Slider'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 300, PAD = 40
const LR = 0.6

const X = d3.range(0, 1.01, 0.05)
const TRUE_Y = X.map(x => 0.3 + 0.4 * Math.sin(x * Math.PI * 2))

function computePredictions(numTrees) {
  let preds = X.map(() => 0.5)
  for (let t = 0; t < numTrees; t++) {
    const residuals = preds.map((p, i) => TRUE_Y[i] - p)
    const treePred = X.map((x, i) => LR * residuals[i] * 0.8)
    preds = preds.map((p, i) => p + treePred[i])
  }
  return preds
}

export function GradientBoostingViz({ resetKey }) {
  const svgRef = useRef(null)
  const [nTrees, setNTrees] = useState(1)
  const { dark } = useTheme()

  useEffect(() => { setNTrees(1) }, [resetKey])

  useEffect(() => {
    const textSec = dark ? '#94a3b8' : '#64748b'

    const xSc = d3.scaleLinear([0, 1], [PAD, W - PAD])
    const ySc = d3.scaleLinear([0, 1.1], [H - PAD, PAD])

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    svg.append('g').attr('class', 'axis').attr('transform', `translate(0,${H-PAD})`).call(d3.axisBottom(xSc).ticks(5))
    svg.append('g').attr('class', 'axis').attr('transform', `translate(${PAD},0)`).call(d3.axisLeft(ySc).ticks(5))

    const line = d3.line().x((_, i) => xSc(X[i])).y(d => ySc(d)).curve(d3.curveCatmullRom)

    svg.append('path').datum(TRUE_Y).attr('fill', 'none')
      .attr('stroke', '#10b981').attr('stroke-width', 2).attr('stroke-dasharray', '6,3')
      .attr('d', line)
    svg.append('text').attr('x', xSc(0.28)).attr('y', ySc(TRUE_Y[5]) - 8).attr('font-size', 10).attr('fill', '#10b981').text('True function')

    const preds = computePredictions(nTrees)
    const mse = d3.mean(preds.map((p, i) => (p - TRUE_Y[i]) ** 2))

    svg.append('path').datum(preds).attr('fill', 'none')
      .attr('stroke', '#6366f1').attr('stroke-width', 2.5)
      .attr('d', line)
    svg.append('text').attr('x', xSc(0.02)).attr('y', ySc(preds[0]) - 8).attr('font-size', 10).attr('fill', '#6366f1')
      .text(`Ensemble (${nTrees} tree${nTrees > 1 ? 's' : ''})`)

    X.forEach((x, i) => {
      const residual = TRUE_Y[i] - preds[i]
      if (Math.abs(residual) > 0.005) {
        svg.append('line')
          .attr('x1', xSc(x)).attr('y1', ySc(preds[i]))
          .attr('x2', xSc(x)).attr('y2', ySc(preds[i] + residual))
          .attr('stroke', residual > 0 ? '#f43f5e' : '#06b6d4').attr('stroke-width', 1.5).attr('opacity', 0.6)
      }
    })

    svg.append('text').attr('x', W - PAD - 2).attr('y', PAD + 14).attr('text-anchor', 'end')
      .attr('font-size', 11).attr('fill', textSec).text(`MSE: ${mse.toFixed(4)}`)
  }, [nTrees, dark])

  return (
    <div>
      <div className="px-4 pt-3 pb-1 w-56">
        <Slider label="Number of trees" value={nTrees} min={1} max={20} step={1} onChange={v => setNTrees(Math.round(v))} />
      </div>
      <div className="flex gap-4 px-4 pb-1 text-xs text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 inline-block" style={{ background: '#10b981', borderTop: '2px dashed #10b981' }} /> True function</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-brand-500 inline-block" /> Ensemble prediction</span>
        <span className="flex items-center gap-1"><span className="w-4 h-0.5 bg-rose-500 inline-block" /> Positive residual</span>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="Gradient boosting ensemble prediction"
      />
    </div>
  )
}
