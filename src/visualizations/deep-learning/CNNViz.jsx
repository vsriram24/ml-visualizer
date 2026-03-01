import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 280

// Simple 8x8 pixel image (edge-like pattern)
const IMG = [
  [0,0,0,1,1,0,0,0],
  [0,0,1,1,1,1,0,0],
  [0,1,1,0,0,1,1,0],
  [1,1,0,0,0,0,1,1],
  [1,1,0,0,0,0,1,1],
  [0,1,1,0,0,1,1,0],
  [0,0,1,1,1,1,0,0],
  [0,0,0,1,1,0,0,0],
]

// 3x3 edge-detection kernel (Sobel-like)
const KERNEL = [[-1,0,1],[-2,0,2],[-1,0,1]]

function convolve(img, kernel) {
  const out = []
  for (let r = 0; r < img.length - 2; r++) {
    const row = []
    for (let c = 0; c < img[0].length - 2; c++) {
      let sum = 0
      for (let kr = 0; kr < 3; kr++)
        for (let kc = 0; kc < 3; kc++)
          sum += img[r + kr][c + kc] * kernel[kr][kc]
      row.push(sum)
    }
    out.push(row)
  }
  return out
}

const FEATURE_MAP = convolve(IMG, KERNEL)
const FM_ROWS = FEATURE_MAP.length    // 6
const FM_COLS = FEATURE_MAP[0].length // 6
const FM_MAX = Math.max(...FEATURE_MAP.flat().map(Math.abs)) || 1

// 36 steps: kernel slides across all 6×6 output positions
export const CNN_STEPS = FM_ROWS * FM_COLS

export function CNNViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const gridLabelFill = dark ? '#94a3b8' : '#64748b'

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const cs = 18  // cell size

    // Layout positions (matching original)
    const imgX = 20, imgY = 50
    const ax  = imgX + IMG[0].length * cs + 10   // 174 — gap between img and kernel
    const kx  = ax + 48                           // 222 — kernel x
    const kY  = 70                                // kernel y
    const ax2 = kx + KERNEL[0].length * cs + 10  // 286 — gap between kernel and fmap
    const fmx = ax2 + 48                          // 334 — feature map x
    const fmY = 60                                // feature map y

    // Current kernel position in the output
    const curIdx = Math.min(step, CNN_STEPS - 1)
    const kr = Math.floor(curIdx / FM_COLS)  // output row
    const kc = curIdx % FM_COLS              // output col

    function drawLabel(text, x, y, cols) {
      svg.append('text').attr('x', x + cols * cs / 2).attr('y', y - 6)
        .attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', gridLabelFill).text(text)
    }

    // === Input image ===
    drawLabel('Input (8×8)', imgX, imgY, IMG[0].length)
    IMG.forEach((row, r) => {
      row.forEach((val, c) => {
        svg.append('rect')
          .attr('x', imgX + c * cs).attr('y', imgY + r * cs)
          .attr('width', cs - 1).attr('height', cs - 1).attr('rx', 2)
          .attr('fill', d3.interpolateGreys(val))
      })
    })

    // Highlight the 3×3 patch currently being convolved
    svg.append('rect')
      .attr('x', imgX + kc * cs - 1.5).attr('y', imgY + kr * cs - 1.5)
      .attr('width', 3 * cs + 2).attr('height', 3 * cs + 2).attr('rx', 3)
      .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2.5)

    // === Arrow 1 ===
    const midY = imgY + IMG.length * cs / 2
    svg.append('text').attr('x', ax + 18).attr('y', midY + 4)
      .attr('font-size', 20).attr('fill', '#6366f1').text('→')
    svg.append('text').attr('x', ax + 18).attr('y', midY + 18)
      .attr('font-size', 8).attr('fill', '#94a3b8').attr('text-anchor', 'middle').text('Conv 3×3')

    // === Kernel (static) ===
    drawLabel('3×3 Kernel', kx, kY, KERNEL[0].length)
    KERNEL.forEach((row, r) => {
      row.forEach((val, c) => {
        svg.append('rect')
          .attr('x', kx + c * cs).attr('y', kY + r * cs)
          .attr('width', cs - 1).attr('height', cs - 1).attr('rx', 2)
          .attr('fill', d3.interpolateRdBu(0.5 + val / 4))
      })
    })

    // === Arrow 2 ===
    svg.append('text').attr('x', ax2 + 18).attr('y', midY + 4)
      .attr('font-size', 20).attr('fill', '#6366f1').text('→')
    svg.append('text').attr('x', ax2 + 18).attr('y', midY + 18)
      .attr('font-size', 8).attr('fill', '#94a3b8').attr('text-anchor', 'middle').text('+ ReLU')

    // === Feature map: progressive fill ===
    drawLabel(`Feature Map (${FM_ROWS}×${FM_COLS})`, fmx, fmY, FM_COLS)
    FEATURE_MAP.forEach((row, r) => {
      row.forEach((val, c) => {
        const cellIdx = r * FM_COLS + c
        const isActive = cellIdx === curIdx
        const isFilled = cellIdx < curIdx

        svg.append('rect')
          .attr('x', fmx + c * cs).attr('y', fmY + r * cs)
          .attr('width', cs - 1).attr('height', cs - 1).attr('rx', 2)
          .attr('fill', d3.interpolateOranges(Math.max(0, val) / FM_MAX))
          .attr('opacity', isFilled || isActive ? 1 : 0.15)

        // Orange border on the currently computed cell
        if (isActive) {
          svg.append('rect')
            .attr('x', fmx + c * cs - 1.5).attr('y', fmY + r * cs - 1.5)
            .attr('width', cs + 2).attr('height', cs + 2).attr('rx', 3)
            .attr('fill', 'none').attr('stroke', '#f59e0b').attr('stroke-width', 2.5)
        }
      })
    })

    // Bottom label
    svg.append('text').attr('x', W / 2).attr('y', H - 12).attr('text-anchor', 'middle')
      .attr('font-size', 10).attr('fill', '#94a3b8')
      .text('Kernel slides over input computing dot products → feature map')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="CNN convolution operation visualization"
    />
  )
}
