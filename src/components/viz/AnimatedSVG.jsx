import { useD3 } from '../../hooks/useD3'

/**
 * Generic SVG wrapper that hands control to D3.
 * @param {function} draw - receives d3.select(svgEl) + {width, height, playing, speed, resetKey}
 */
export function AnimatedSVG({ draw, width = '100%', height = 340, deps = [], playing, speed, resetKey, className = '' }) {
  const ref = useD3(
    (selection) => {
      selection.attr('width', '100%').attr('height', height)
      draw(selection, { playing, speed, resetKey })
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playing, speed, resetKey, ...deps]
  )

  return (
    <svg
      ref={ref}
      width={width}
      height={height}
      className={`viz-svg block w-full ${className}`}
      role="img"
      aria-label="Interactive visualization"
    />
  )
}
