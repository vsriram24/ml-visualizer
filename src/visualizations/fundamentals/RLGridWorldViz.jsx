import { useEffect, useRef, useState, useCallback } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const GRID = 6
const CELL = 58
const PAD = 10
const W = GRID * CELL + PAD * 2
const H = GRID * CELL + PAD * 2

const START = [5, 0]
const GOAL  = [0, 5]

export const RL_STEPS = 200

function stateKey([r, c]) { return `${r},${c}` }

function initQ(walls) {
  const q = {}
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      if (walls.has(stateKey([r, c]))) continue
      q[stateKey([r, c])] = [0, 0, 0, 0]
    }
  }
  return q
}

const DIRS = [[-1, 0], [0, 1], [1, 0], [0, -1]]
const DIR_ARROWS = ['↑', '→', '↓', '←']

export function RLGridWorldViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()
  const rlRef = useRef({
    walls: new Set(['2,2', '2,3', '3,2', '4,1']),
    q: null,
    agentPos: [...START],
    episode: 0,
  })
  const prevStepRef = useRef(-1)
  const [episode, setEpisode] = useState(0)

  const draw = useCallback(() => {
    const isDark = document.documentElement.classList.contains('dark')
    const cellBg    = isDark ? '#1e293b' : '#f1f5f9'
    const cellStroke = isDark ? '#334155' : '#e2e8f0'
    const arrowFill = isDark ? '#60a5fa' : '#1e40af'

    const { walls, q, agentPos } = rlRef.current
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    for (let r = 0; r < GRID; r++) {
      for (let c = 0; c < GRID; c++) {
        const x = PAD + c * CELL, y = PAD + r * CELL
        const key = stateKey([r, c])
        const isWall = walls.has(key)
        const isGoal = r === GOAL[0] && c === GOAL[1]
        const isAgent = agentPos[0] === r && agentPos[1] === c

        svg.append('rect')
          .attr('x', x).attr('y', y)
          .attr('width', CELL - 2).attr('height', CELL - 2)
          .attr('rx', 4)
          .attr('fill', isWall ? '#475569' : isGoal ? '#10b981' : cellBg)
          .attr('stroke', cellStroke).attr('stroke-width', 1)

        if (q && !isWall && !isGoal) {
          const qVals = q[key] || [0, 0, 0, 0]
          const maxQ = Math.max(...qVals)
          if (maxQ > 0) {
            svg.append('rect')
              .attr('x', x).attr('y', y)
              .attr('width', CELL - 2).attr('height', CELL - 2)
              .attr('rx', 4)
              .attr('fill', d3.interpolateYlGn(Math.min(maxQ / 10, 1)))
              .attr('opacity', 0.5)
            const bestDir = qVals.indexOf(maxQ)
            svg.append('text')
              .attr('x', x + (CELL - 2) / 2).attr('y', y + (CELL - 2) / 2 + 5)
              .attr('text-anchor', 'middle').attr('font-size', 18).attr('fill', arrowFill)
              .attr('opacity', 0.85).text(DIR_ARROWS[bestDir])
          }
        }

        if (isGoal) {
          svg.append('text').attr('x', x + (CELL-2)/2).attr('y', y + (CELL-2)/2 + 6)
            .attr('text-anchor', 'middle').attr('font-size', 22).text('🎯')
        }
        if (isAgent) {
          svg.append('text').attr('x', x + (CELL-2)/2).attr('y', y + (CELL-2)/2 + 6)
            .attr('text-anchor', 'middle').attr('font-size', 20).text('🤖')
        }
      }
    }

    svg.selectAll('rect.overlay')
      .data(d3.cross(d3.range(GRID), d3.range(GRID)))
      .join('rect')
      .attr('class', 'overlay')
      .attr('x', ([, c]) => PAD + c * CELL)
      .attr('y', ([r]) => PAD + r * CELL)
      .attr('width', CELL - 2).attr('height', CELL - 2)
      .attr('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('click', (_, [r, c]) => {
        const key = stateKey([r, c])
        if (r === START[0] && c === START[1]) return
        if (r === GOAL[0] && c === GOAL[1]) return
        const { walls } = rlRef.current
        if (walls.has(key)) walls.delete(key)
        else walls.add(key)
        rlRef.current.q = null
        rlRef.current.agentPos = [...START]
        rlRef.current.episode = 0
        prevStepRef.current = -1
        setEpisode(0)
        draw()
      })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dark])

  const runQStep = useCallback(() => {
    const s = rlRef.current
    if (!s.q) s.q = initQ(s.walls)

    const [r, c] = s.agentPos
    const key = stateKey([r, c])

    if (r === GOAL[0] && c === GOAL[1]) {
      s.agentPos = [...START]
      s.episode++
      setEpisode(s.episode)
      return
    }

    const alpha = 0.3, gamma = 0.9
    const epsilon = Math.max(0.05, 0.5 - s.episode * 0.01)
    const qVals = s.q[key] || [0, 0, 0, 0]

    const action = Math.random() < epsilon
      ? Math.floor(Math.random() * 4)
      : qVals.indexOf(Math.max(...qVals))

    const [dr, dc] = DIRS[action]
    const nr = r + dr, nc = c + dc
    const nKey = stateKey([nr, nc])
    const valid = nr >= 0 && nr < GRID && nc >= 0 && nc < GRID && !s.walls.has(nKey)
    const nextR = valid ? nr : r
    const nextC = valid ? nc : c
    const nextKey = stateKey([nextR, nextC])

    const reward = (nextR === GOAL[0] && nextC === GOAL[1]) ? 10 : (valid ? -0.1 : -1)
    if (!s.q[nextKey]) s.q[nextKey] = [0, 0, 0, 0]
    const maxNext = Math.max(...s.q[nextKey])
    s.q[key][action] = qVals[action] + alpha * (reward + gamma * maxNext - qVals[action])
    s.agentPos = [nextR, nextC]
  }, [])

  useEffect(() => {
    rlRef.current = { walls: new Set(['2,2', '2,3', '3,2', '4,1']), q: null, agentPos: [...START], episode: 0 }
    prevStepRef.current = -1
    setEpisode(0)
    draw()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey])

  useEffect(() => { draw() }, [draw])

  useEffect(() => {
    if (prevStepRef.current === step) return
    prevStepRef.current = step
    runQStep()
    draw()
  }, [step, runQStep, draw])

  return (
    <div>
      <div className="flex items-center gap-3 px-4 pt-3 pb-1">
        <span className="text-xs text-slate-500 dark:text-slate-400">
          Episode: <strong className="text-slate-900 dark:text-slate-100 font-mono">{episode}</strong>
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">Click cells to toggle walls</span>
      </div>
      <svg
        ref={svgRef}
        width={W} height={H}
        viewBox={`0 0 ${W} ${H}`}
        className="w-full h-auto viz-svg"
        aria-label="Reinforcement learning grid world"
      />
    </div>
  )
}
