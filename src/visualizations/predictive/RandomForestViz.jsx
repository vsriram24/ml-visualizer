import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const TREE_DATA = [
  { pred: 0, votes: [3, 1] }, { pred: 0, votes: [2, 2] }, { pred: 1, votes: [1, 3] },
  { pred: 0, votes: [4, 0] }, { pred: 1, votes: [0, 4] }, { pred: 0, votes: [3, 1] },
]

// Steps 0-5: reveal trees one by one. Step 6: show ensemble result.
export const RANDOM_FOREST_STEPS = 7

export function RandomForestViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const textPri    = dark ? '#f1f5f9' : '#1e293b'
    const textSec    = dark ? '#94a3b8' : '#64748b'
    const textMuted  = dark ? '#64748b' : '#94a3b8'
    const inactiveBg = dark ? '#1e293b' : '#f1f5f9'
    const inactiveStroke = dark ? '#475569' : '#cbd5e1'
    const activeBg0  = dark ? '#1e3a5f' : '#dbeafe'   // blue tint
    const activeBg1  = dark ? '#4c1a2a' : '#fce7f3'   // rose tint
    const barTrack   = dark ? '#334155' : '#e2e8f0'
    const crownFill  = dark ? '#14532d' : '#bbf7d0'

    const W = 480, H = 280
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const activeTrees = Math.min(step, TREE_DATA.length)
    const showResult = step >= TREE_DATA.length

    const totalVotes = TREE_DATA.reduce((acc, t) => [acc[0] + t.votes[0], acc[1] + t.votes[1]], [0, 0])
    const winner = totalVotes[0] > totalVotes[1] ? 0 : 1

    svg.append('text').attr('x', W / 2).attr('y', 18).attr('text-anchor', 'middle')
      .attr('font-size', 12).attr('font-weight', 600).attr('fill', textPri)
      .text('6 Decision Trees — Majority Vote')

    const treeW = 60, treeH = 96
    const startX = 28, startY = 36, gap = 72

    TREE_DATA.forEach((tree, i) => {
      const x = startX + i * gap
      const y = startY
      const isActive = i < activeTrees

      const g = svg.append('g').attr('opacity', isActive ? 1 : 0.4)

      g.append('rect').attr('x', x).attr('y', y).attr('width', treeW).attr('height', treeH).attr('rx', 6)
        .attr('fill', isActive ? (tree.pred === 0 ? activeBg0 : activeBg1) : inactiveBg)
        .attr('stroke', isActive ? (tree.pred === 0 ? '#3b82f6' : '#f43f5e') : inactiveStroke)
        .attr('stroke-width', isActive ? 2 : 1)

      g.append('circle').attr('cx', x + 30).attr('cy', y + 24).attr('r', 16).attr('fill', crownFill).attr('opacity', 0.7)
      g.append('rect').attr('x', x + 27).attr('y', y + 38).attr('width', 6).attr('height', 18).attr('fill', '#92400e')

      g.append('text').attr('x', x + 30).attr('y', y + 68).attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('font-weight', 700)
        .attr('fill', tree.pred === 0 ? '#60a5fa' : '#fb7185')
        .text(`Tree ${i + 1}`)
      g.append('text').attr('x', x + 30).attr('y', y + 80).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', textSec).text(`→ Class ${tree.pred}`)

      const barW = 56, barX = x + 2
      g.append('rect').attr('x', barX).attr('y', y + 83).attr('width', barW).attr('height', 8).attr('rx', 4).attr('fill', barTrack)
      const voteRatio = tree.votes[0] / (tree.votes[0] + tree.votes[1])
      g.append('rect').attr('x', barX).attr('y', y + 83)
        .attr('width', isActive ? barW * voteRatio : 0)
        .attr('height', 8).attr('rx', 4).attr('fill', '#06b6d4')
    })

    if (showResult) {
      const resultX = W / 2, resultY = 200

      svg.append('text').attr('x', resultX).attr('y', resultY)
        .attr('text-anchor', 'middle').attr('font-size', 11).attr('fill', textSec)
        .text(`Votes: Class 0 = ${totalVotes[0]}, Class 1 = ${totalVotes[1]}`)

      svg.append('rect').attr('x', resultX - 60).attr('y', resultY + 14).attr('width', 120).attr('height', 42).attr('rx', 10)
        .attr('fill', winner === 0 ? activeBg0 : activeBg1)
        .attr('stroke', winner === 0 ? '#3b82f6' : '#f43f5e').attr('stroke-width', 2.5)

      svg.append('text').attr('x', resultX).attr('y', resultY + 30).attr('text-anchor', 'middle')
        .attr('font-size', 10).attr('fill', textSec).text('Ensemble predicts:')

      svg.append('text').attr('x', resultX).attr('y', resultY + 47).attr('text-anchor', 'middle')
        .attr('font-size', 16).attr('font-weight', 700).attr('fill', winner === 0 ? '#60a5fa' : '#fb7185')
        .text(`Class ${winner} 👑`)
    } else {
      svg.append('text').attr('x', W / 2).attr('y', H - 8).attr('text-anchor', 'middle')
        .attr('font-size', 11).attr('fill', textMuted).text(`${activeTrees} / ${TREE_DATA.length} trees active`)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={480} height={280}
      viewBox="0 0 480 280"
      className="w-full h-auto viz-svg"
      aria-label="Random forest ensemble voting"
    />
  )
}
