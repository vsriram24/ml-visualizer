import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useTheme } from '../../context/ThemeContext'

const W = 480, H = 320

const TREE = {
  feature: 'x₁', threshold: 0.5,
  gini: 0.48, samples: 60,
  left: {
    feature: 'x₂', threshold: 0.4,
    gini: 0.36, samples: 30,
    left: { leaf: true, cls: 0, gini: 0.12, samples: 24 },
    right: { leaf: true, cls: 1, gini: 0.28, samples: 6 },
  },
  right: {
    feature: 'x₂', threshold: 0.6,
    gini: 0.40, samples: 30,
    left: { leaf: true, cls: 1, gini: 0.15, samples: 22 },
    right: { leaf: true, cls: 0, gini: 0.22, samples: 8 },
  },
}

// Reveal order: root, left-internal, LL, LR, right-internal, RL, RR
export const DECISION_TREE_STEPS = 7

const CLS_COLOR = ['#06b6d4', '#f43f5e']
const CLS_LABEL = ['Class A', 'Class B']

function layoutTree(node, x, y, spread) {
  node.px = x; node.py = y
  if (!node.leaf) {
    node.left  && layoutTree(node.left,  x - spread / 2, y + 80, spread / 2)
    node.right && layoutTree(node.right, x + spread / 2, y + 80, spread / 2)
  }
  return node
}

// Pre-order traversal: root → left subtree → right subtree
function getRevealOrder(node, acc = []) {
  if (!node) return acc
  acc.push(node)
  if (!node.leaf) {
    getRevealOrder(node.left, acc)
    getRevealOrder(node.right, acc)
  }
  return acc
}

export function DecisionTreeViz({ step = 0, resetKey }) {
  const svgRef = useRef(null)
  const { dark } = useTheme()

  useEffect(() => {
    const nodeBg        = dark ? '#1e293b' : '#f1f5f9'
    const nodeTextPri   = dark ? '#f1f5f9' : '#1e293b'
    const nodeTextSec   = dark ? '#94a3b8' : '#64748b'
    const edgeStroke    = dark ? '#475569' : '#94a3b8'
    const edgeLabelFill = dark ? '#94a3b8' : '#64748b'
    const leafOpacity   = dark ? 0.30 : 0.15

    const tree = JSON.parse(JSON.stringify(TREE))
    layoutTree(tree, W / 2, 36, W / 2)
    const revealOrder = getRevealOrder(tree)

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const visibleCount = Math.min(step + 1, revealOrder.length)
    const visibleNodes = new Set(revealOrder.slice(0, visibleCount))

    function drawNode(node) {
      if (!visibleNodes.has(node)) return

      if (!node.leaf) {
        // Draw edges to visible children
        ;[node.left, node.right].forEach((child, side) => {
          if (!child || !visibleNodes.has(child)) return
          svg.append('line')
            .attr('x1', node.px).attr('y1', node.py + 22)
            .attr('x2', child.px).attr('y2', child.py - 22)
            .attr('stroke', edgeStroke).attr('stroke-width', 1.5)
          svg.append('text')
            .attr('x', (node.px + child.px) / 2 + (side === 0 ? -14 : 4))
            .attr('y', (node.py + child.py) / 2)
            .attr('font-size', 10).attr('fill', edgeLabelFill)
            .text(side === 0 ? `≤ ${node.threshold}` : `> ${node.threshold}`)
        })

        // Draw children first (z-order)
        drawNode(node.left)
        drawNode(node.right)

        const g = svg.append('g').attr('transform', `translate(${node.px}, ${node.py})`)
        g.append('rect').attr('x', -46).attr('y', -22).attr('width', 92).attr('height', 44).attr('rx', 8)
          .attr('fill', nodeBg).attr('stroke', '#6366f1').attr('stroke-width', 1.5)
        g.append('text').attr('y', -6).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 600).attr('fill', nodeTextPri)
          .text(`${node.feature} ≤ ${node.threshold}`)
        g.append('text').attr('y', 8).attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', nodeTextSec)
          .text(`Gini: ${node.gini}  n=${node.samples}`)
      } else {
        const g = svg.append('g').attr('transform', `translate(${node.px}, ${node.py})`)
        g.append('rect').attr('x', -36).attr('y', -22).attr('width', 72).attr('height', 44).attr('rx', 8)
          .attr('fill', CLS_COLOR[node.cls]).attr('opacity', leafOpacity)
          .attr('stroke', CLS_COLOR[node.cls]).attr('stroke-width', 2)
        g.append('text').attr('y', -6).attr('text-anchor', 'middle').attr('font-size', 12).attr('font-weight', 700).attr('fill', CLS_COLOR[node.cls])
          .text(CLS_LABEL[node.cls])
        g.append('text').attr('y', 8).attr('text-anchor', 'middle').attr('font-size', 10).attr('fill', nodeTextSec)
          .text(`n=${node.samples}`)
      }
    }

    drawNode(tree)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, resetKey, dark])

  return (
    <svg
      ref={svgRef}
      width={W} height={H}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto viz-svg"
      aria-label="Decision tree structure visualization"
    />
  )
}
