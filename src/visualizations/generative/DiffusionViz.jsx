import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'

const TIMESTEPS = [0, 100, 250, 400, 600, 800, 1000]
const LABELS = ['Clean', 't=100', 't=250', 't=400', 't=600', 't=800', 'Noise']

// Each step highlights one timestep in the strip. loops=true.
export const DIFFUSION_STEPS = TIMESTEPS.length

function renderNoiseFrame(ctx, t, tMax, imgSize = 64) {
  const noiseAmount = t / tMax
  // Use a deterministic pseudo-random based on pixel position + t
  const imageData = ctx.createImageData(imgSize, imgSize)
  for (let r = 0; r < imgSize; r++) {
    for (let c = 0; c < imgSize; c++) {
      const dx = c - imgSize / 2, dy = r - imgSize / 2
      const dist = Math.sqrt(dx * dx + dy * dy)
      const ring = Math.sin(dist / 4) * 0.5 + 0.5
      // Deterministic "noise" using sine hash
      const noiseSeed = Math.sin(r * 127.1 + c * 311.7 + t * 0.01) * 43758.5453
      const noise = noiseSeed - Math.floor(noiseSeed)
      const v = ring * (1 - noiseAmount) + noise * noiseAmount
      const idx = (r * imgSize + c) * 4
      const bv = Math.round(v * 255)
      imageData.data[idx]     = bv
      imageData.data[idx + 1] = Math.round(bv * (1 - noiseAmount * 0.5))
      imageData.data[idx + 2] = Math.round(bv * (1 - noiseAmount * 0.3))
      imageData.data[idx + 3] = 255
    }
  }
  ctx.putImageData(imageData, 0, 0)
}

export function DiffusionViz({ step = 0, resetKey }) {
  const canvasRefs = useRef([])
  const [direction, setDirection] = useState('forward')
  const { dark } = useTheme()

  // Render all canvases when direction/resetKey changes
  useEffect(() => {
    canvasRefs.current.forEach((canvas, i) => {
      if (!canvas) return
      const ctx = canvas.getContext('2d')
      const t = direction === 'forward' ? TIMESTEPS[i] : TIMESTEPS[TIMESTEPS.length - 1 - i]
      renderNoiseFrame(ctx, t, 1000, 64)
    })
  }, [direction, resetKey])

  const activeT = step % TIMESTEPS.length

  const svgBorderStroke = dark ? '#334155' : '#e2e8f0'
  const tickStroke      = dark ? '#94a3b8' : '#64748b'

  return (
    <div>
      <div className="flex gap-2 px-4 pt-3 pb-2">
        <button
          onClick={() => setDirection('forward')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${direction === 'forward' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}
        >
          Forward (add noise)
        </button>
        <button
          onClick={() => setDirection('reverse')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors ${direction === 'reverse' ? 'bg-brand-500 text-white border-brand-500' : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400'}`}
        >
          Reverse (denoise)
        </button>
      </div>

      <div className="flex items-center justify-center gap-2 px-4 pb-4">
        {TIMESTEPS.map((t, i) => {
          const label = direction === 'forward' ? LABELS[i] : LABELS[TIMESTEPS.length - 1 - i]
          const isActive = activeT === i
          return (
            <div key={t} className="flex flex-col items-center gap-1.5">
              <div className={`relative rounded-lg overflow-hidden transition-all ${isActive ? 'ring-2 ring-brand-500 shadow-lg scale-110' : ''}`}>
                <canvas
                  ref={el => canvasRefs.current[i] = el}
                  width={64} height={64}
                  style={{ width: 56, height: 56, imageRendering: 'pixelated' }}
                  className="block"
                  aria-label={`Diffusion step ${label}`}
                />
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
            </div>
          )
        })}
      </div>

      <div className="px-4 pb-3">
        <p className="text-xs text-slate-400 mb-1">Noise schedule (linear β schedule)</p>
        <svg width="100%" height={32} viewBox="0 0 480 32" className="w-full">
          <defs>
            <linearGradient id="noise-grad" x1="0%" x2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#94a3b8" />
            </linearGradient>
          </defs>
          <rect x={20} y={12} width={440} height={8} rx={4} fill="url(#noise-grad)" opacity={0.4} />
          <rect x={20} y={12} width={440} height={8} rx={4} fill="none" stroke={svgBorderStroke} />
          {TIMESTEPS.map((t, i) => {
            const x = 20 + (t / 1000) * 440
            return (
              <g key={t}>
                <line x1={x} y1={8} x2={x} y2={24} stroke={tickStroke} strokeWidth={1} opacity={0.5} />
                <text x={x} y={31} textAnchor="middle" fontSize={8} fill="#94a3b8">{t}</text>
              </g>
            )
          })}
          <text x={20} y={8} fontSize={9} fill="#10b981">Clean</text>
          <text x={440} y={8} textAnchor="end" fontSize={9} fill="#94a3b8">Noise</text>
        </svg>
      </div>
    </div>
  )
}
