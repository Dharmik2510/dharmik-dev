import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import styles from './BootSequence.module.css'

function MatrixText({ text, duration = 600 }) {
  const [display, setDisplay] = useState(text.replace(/./g, '-'))
  
  useEffect(() => {
    let start = Date.now()
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*+<>:;=?!/\\_'
    let raf
    
    const tick = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      
      let nextStr = ''
      for(let i = 0; i < text.length; i++) {
        const charProgress = i / text.length
        if (text[i] === ' ' || text[i] === '>') {
           nextStr += text[i]
        }
        else if (progress >= charProgress + 0.15) {
          nextStr += text[i]
        } else if (progress > charProgress - 0.1) {
          nextStr += chars[Math.floor(Math.random() * chars.length)]
        } else {
          nextStr += '-'
        }
      }
      setDisplay(nextStr)
      if (progress < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        setDisplay(text)
      }
    }
    tick()
    return () => cancelAnimationFrame(raf)
  }, [text, duration])
  
  return <span>{display}</span>
}

const BOOT_LINES = [
  { text: '> INITIALIZING DEVAIR FLIGHT SYSTEMS...', delay: 0 },
  { text: '> Loading navigation module ............ OK', delay: 300 },
  { text: '> Calibrating AI subsystems ............ OK', delay: 600 },
  { text: '> Route: AMD → YHZ → YUL → YYZ ........ SET', delay: 900 },
  { text: '> Passenger: DHARMIK SONI .............. VERIFIED', delay: 1200 },
  { text: '> Apache Kafka streams ................. ONLINE', delay: 1500 },
  { text: '> Databricks cluster ................... ACTIVE', delay: 1700 },
  { text: '> Boarding pass ........................ SCANNED', delay: 1900 },
  { text: '> ALL SYSTEMS NOMINAL — WELCOME ABOARD', delay: 2200 },
]

export default function BootSequence({ onComplete }) {
  const [visibleLines, setVisibleLines] = useState([])
  const [done, setDone] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timers = BOOT_LINES.map((line, i) =>
      setTimeout(() => {
        setVisibleLines(prev => [...prev, line.text])
        setProgress(((i + 1) / BOOT_LINES.length) * 100)
      }, line.delay)
    )

    const finishTimer = setTimeout(() => setDone(true), 2800)
    const completeTimer = setTimeout(() => onComplete?.(), 3400)

    return () => {
      timers.forEach(clearTimeout)
      clearTimeout(finishTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className={styles.boot}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.6, ease: [.16,1,.3,1] }}
        >
          <div className={styles.inner}>
            <div className={styles.header}>
              <span className={styles.airline}>✦ DEVAIR</span>
              <span className={styles.system}>FLIGHT CONTROL v3.2.1</span>
            </div>

            <div className={styles.terminal}>
              {visibleLines.map((line, i) => (
                <motion.div
                  key={i}
                  className={styles.line}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {line.includes('OK') || line.includes('SET') || line.includes('VERIFIED') || line.includes('ONLINE') || line.includes('ACTIVE') || line.includes('SCANNED')
                    ? <><MatrixText text={line.slice(0, line.lastIndexOf('.') + 1)} /> <span className={styles.ok}><MatrixText text={line.slice(line.lastIndexOf('.') + 2).trim()} duration={300} /></span></>
                    : line.includes('WELCOME')
                      ? <span className={styles.welcome}><MatrixText text={line} duration={1000} /></span>
                      : <MatrixText text={line} />
                  }
                </motion.div>
              ))}
              <span className={styles.cursor}>_</span>
            </div>

            <div className={styles.progressWrap}>
              <div className={styles.progressBar}>
                <motion.div
                  className={styles.progressFill}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                />
              </div>
              <span className={styles.progressText}>{Math.round(progress)}%</span>
            </div>

            <div className={styles.footer}>
              <span>AMD → YHZ → YUL → YYZ</span>
              <span className={styles.scanText}>SCANNING BOARDING PASS...</span>
            </div>
          </div>

          {/* Scanline overlay */}
          <div className={styles.scanlines} />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
