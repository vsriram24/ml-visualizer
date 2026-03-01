import { useRef, useEffect } from 'react'
import * as d3 from 'd3'

/**
 * React/D3 bridge: D3 owns all DOM mutations inside the returned ref.
 * @param {(selection: d3.Selection) => void} renderFn  - receives d3.select(ref.current)
 * @param {any[]} deps - re-runs when any dep changes
 */
export function useD3(renderFn, deps = []) {
  const ref = useRef(null)

  useEffect(() => {
    if (ref.current) {
      renderFn(d3.select(ref.current))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return ref
}
