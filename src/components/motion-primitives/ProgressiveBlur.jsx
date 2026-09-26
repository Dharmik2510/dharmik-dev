// Adapted from motion-primitives ProgressiveBlur (MIT) — https://motion-primitives.com/docs/progressive-blur
import React from 'react'

const ANGLES = { top: 0, right: 90, bottom: 180, left: 270 }

export function ProgressiveBlur({ direction = 'bottom', blurLayers = 8, blurIntensity = 0.25, className = '', style }) {
  const layers = Math.max(blurLayers, 2)
  const seg = 1 / (blurLayers + 1)
  return (
    <div className={`mp-pblur ${className}`} style={style} aria-hidden="true">
      {Array.from({ length: layers }).map((_, i) => {
        const stops = [i * seg, (i + 1) * seg, (i + 2) * seg, (i + 3) * seg]
          .map((p, k) => `rgba(255,255,255,${k === 1 || k === 2 ? 1 : 0}) ${p * 100}%`)
        const g = `linear-gradient(${ANGLES[direction]}deg, ${stops.join(', ')})`
        return (
          <div
            key={i}
            className="mp-pblur-layer"
            style={{
              maskImage: g, WebkitMaskImage: g,
              backdropFilter: `blur(${i * blurIntensity}px)`,
              WebkitBackdropFilter: `blur(${i * blurIntensity}px)`,
            }}
          />
        )
      })}
    </div>
  )
}

export default ProgressiveBlur
