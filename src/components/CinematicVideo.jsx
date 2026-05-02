import React, { useEffect, useRef, useState } from 'react'

export default function CinematicVideo({
  src,
  poster,
  opacity = 0.28,
  blendMode = 'screen',
  className = '',
}) {
  const videoRef = useRef(null)
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(m.matches)
    const onChange = () => setReduced(m.matches)
    m.addEventListener?.('change', onChange)
    return () => m.removeEventListener?.('change', onChange)
  }, [])

  useEffect(() => {
    if (reduced || !videoRef.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        const v = videoRef.current
        if (!v) return
        if (entry.isIntersecting) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 }
    )
    io.observe(videoRef.current)
    return () => io.disconnect()
  }, [reduced])

  if (reduced) {
    return (
      <div
        className={`cinematic-poster ${className}`}
        style={{
          backgroundImage: `url(${poster})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity,
        }}
        aria-hidden="true"
      />
    )
  }

  return (
    <video
      ref={videoRef}
      className={`cinematic-video ${className}`}
      src={src}
      poster={poster}
      muted
      loop
      playsInline
      preload="metadata"
      style={{ opacity, mixBlendMode: blendMode }}
      aria-hidden="true"
    />
  )
}
