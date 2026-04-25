import React from 'react'
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

export default function ScrollProgress() {
  const progress = useScrollProgress()

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
      {WAYPOINTS.map((wp) => {
        const active = progress >= wp.position - 0.05
        return (
          <a
            key={wp.label}
            href={`#${wp.section}`}
            className={`${styles.dot} ${active ? styles.dotActive : ''}`}
            style={{ top: `${wp.position * 100}%` }}
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
