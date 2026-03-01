import { useRef, useEffect, useCallback } from 'react'

/**
 * rAF loop with play/pause and speed control.
 * @param {(elapsed: number, dt: number) => void} callback
 * @param {boolean} playing
 * @param {number} speed  - multiplier (0.5 | 1 | 2)
 */
export function useAnimationFrame(callback, playing = true, speed = 1) {
  const callbackRef = useRef(callback)
  const rafRef = useRef(null)
  const lastTimeRef = useRef(null)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  const loop = useCallback((timestamp) => {
    if (lastTimeRef.current === null) lastTimeRef.current = timestamp
    const raw = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp
    const dt = raw * speed
    callbackRef.current(timestamp, dt)
    rafRef.current = requestAnimationFrame(loop)
  }, [speed])

  useEffect(() => {
    if (!playing) {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
        lastTimeRef.current = null
      }
      return
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      lastTimeRef.current = null
    }
  }, [playing, loop])
}
