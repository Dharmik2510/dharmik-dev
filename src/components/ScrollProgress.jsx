import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollProgress } from '../hooks'
import styles from './ScrollProgress.module.css'

const WAYPOINTS = [
  { label: 'Intro', section: 'home', position: 0 },
  { label: 'Story', section: 'journey', position: 0.2 },
  { label: 'About', section: 'about', position: 0.45 },
  { label: 'Work', section: 'experience', position: 0.65 },
  { label: 'Builds', section: 'projects', position: 0.8 },
  { label: 'Contact', section: 'contact', position: 1.0 },
]

// Waypoint dots sit where each section actually starts in the document, so the
// rail stays accurate even though the Journey film is many screens tall.
function useWaypointPositions() {
  const [pos, setPos] = useState(() => WAYPOINTS.map((w) => w.position))
  useEffect(() => {
    const measure = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      setPos(WAYPOINTS.map((w) => {
        const el = document.getElementById(w.section)
        if (!el) return w.position
        const top = el.getBoundingClientRect().top + window.scrollY
        return Math.min(1, Math.max(0, top / max))
      }))
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    window.addEventListener('resize', measure)
    return () => { ro.disconnect(); window.removeEventListener('resize', measure) }
  }, [])
  return pos
}

export default function ScrollProgress() {
  const progress = useScrollProgress()
  const positions = useWaypointPositions()

  return (
    <div className={styles.wrap} aria-hidden="true">
      {/* Track line */}
      <div className={styles.track}>
        <motion.div
          className={styles.fill}
          style={{ height: `${progress * 100}%` }}
        />
      </div>

      {/* Waypoint dots */}
      {WAYPOINTS.map((wp, i) => {
        const position = positions[i]
        const active = progress >= position - 0.01
        return (
          <a
            key={wp.label}
            href={`#${wp.section}`}
            className={`${styles.dot} ${active ? styles.dotActive : ''}`}
            style={{ top: `${position * 100}%` }}
            title={wp.label}
          >
            <span className={styles.dotInner} />
            <span className={styles.dotLabel}>{wp.label}</span>
          </a>
        )
      })}

      {/* Moving plane indicator */}
      <div
        className={styles.plane}
        style={{ top: `${progress * 100}%` }}
      >
        ✈
      </div>
    </div>
  )
}
