import React, { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { TextEffect, TextScramble } from './motion-primitives'
import styles from './Hero.module.css'

// Scramble-in value for the boarding pass (split-flap feel on load)
const Flap = ({ children, delay = 0 }) => {
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), delay * 1000); return () => clearTimeout(t) }, [delay])
  return <TextScramble as="span" trigger={go} duration={0.7} speed={0.035}>{children}</TextScramble>
}

function BoardingPass({ progress }) {
  const reduce = useReducedMotion()
  const still = (v) => (reduce ? v[0] : v)

  // ── scroll-driven boarding sequence ──
  // 1) barcode gets scanned  2) the stub tears off  3) the pass lifts away into the story
  const scanX = useTransform(progress, [0.02, 0.2], ['-10%', '110%'])
  const scanOpacity = useTransform(progress, [0.01, 0.04, 0.18, 0.22], [0, 1, 1, 0])
  const stubY = useTransform(progress, [0.18, 0.6], still([0, 190]))
  const stubX = useTransform(progress, [0.18, 0.6], still([0, 36]))
  const stubRotate = useTransform(progress, [0.18, 0.6], still([0, 16]))
  const stubOpacity = useTransform(progress, [0.4, 0.62], [1, 0])
  const liftY = useTransform(progress, [0.25, 1], still([0, -60]))
  const liftRotX = useTransform(progress, [0.25, 1], still([0, 38]))
  const liftScale = useTransform(progress, [0.25, 1], still([1, 0.82]))
  const liftOpacity = useTransform(progress, [0.55, 0.95], [1, 0])

  const [boarded, setBoarded] = useState(false)
  useMotionValueEvent(progress, 'change', (v) => {
    const b = v > 0.12
    setBoarded((prev) => (prev === b ? prev : b))
  })

  const tiltRef = useRef(null)

  // 3D tilt on mouse move
  useEffect(() => {
    const card = tiltRef.current
    if (!card) return
    const onMove = (e) => {
      const rect = card.getBoundingClientRect()
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height
      card.style.transform = `rotateX(${-dy * 10}deg) rotateY(${dx * 10}deg)`
      card.style.transition = 'transform .08s ease'
    }
    const onLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)'
      card.style.transition = 'transform .7s cubic-bezier(.16,1,.3,1)'
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  // Draw barcode
  useEffect(() => {
    const canvas = document.getElementById('bp-barcode')
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const W = 82, H = 42
    const bars = []
    let x = 0
    for (let i = 0; i < 34; i++) bars.push({ w: Math.random() < .5 ? 1 : 2 })
    bars.forEach(b => { b.x = x; x += b.w + (Math.random() < .3 ? 2 : 1) })
    const sc = W / x
    bars.forEach((b, i) => {
      ctx.fillStyle = `rgba(0,229,255,${i % 3 === 0 ? .9 : i % 2 === 0 ? .6 : .38})`
      ctx.fillRect(Math.floor(b.x * sc), 0, Math.max(1, Math.floor(b.w * sc)), H - 6)
    })
    ctx.fillStyle = 'rgba(0,229,255,.28)'
    ctx.font = '5px JetBrains Mono,monospace'
    ctx.textAlign = 'center'
    ctx.fillText('AI-PLATFORM-01', W / 2, H)
  }, [])

  return (
    <motion.div
      className={styles.bpWrap}
      initial={{ opacity: 0, y: 30, rotate: 5 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 1.2, delay: 0.65, ease: [.16,1,.3,1] }}
      style={{ perspective: 900 }}
    >
      <motion.div
        className={styles.bpLift}
        style={{ y: liftY, rotateX: liftRotX, scale: liftScale, opacity: liftOpacity }}
      >
      <div className={styles.bpShadow} />
      <div className={styles.bpTilt} ref={tiltRef}>
      <div className={styles.bp}>
        <div className={styles.bpGlint} />
        <div className={`${styles.bpPerf} ${styles.bpPerfTop}`} />
        <div className={`${styles.bpNotch} ${styles.bpNlt}`} />
        <div className={`${styles.bpNotch} ${styles.bpNrt}`} />

        {/* Header */}
        <div className={styles.bpHd}>
          <div>
            <div className={styles.bpAirline}>SONI SYSTEMS</div>
            <div className={styles.bpAirlineSub}>// AI PLATFORM ENGINEERING</div>
          </div>
          <div className={styles.bpClass}>AI CLASS</div>
        </div>

        {/* Profile signal */}
        <div className={styles.bpRoute}>
          <div className={styles.bpCity}>
            <div className={styles.bpIata}><Flap delay={0.9}>AI</Flap></div>
            <div className={styles.bpCityName}>Platform</div>
            <div className={styles.bpCityCountry}>Systems</div>
          </div>
          <div className={styles.bpMid}>
            <div className={styles.bpArc}>
              <div className={styles.bpArcDot} />
              <div className={styles.bpArcLine} />
              <div className={styles.bpArcDot} />
            </div>
            <div className={styles.bpPlaneIco}>✈</div>
            <div className={styles.bpKm}>PRODUCTION</div>
          </div>
          <div className={styles.bpCity}>
            <div className={`${styles.bpIata} ${styles.bpIataDest}`}><Flap delay={1.05}>ML</Flap></div>
            <div className={styles.bpCityName}>Data</div>
            <div className={styles.bpCityCountry}>Governance</div>
          </div>
        </div>

        {/* Details grid */}
        <div className={styles.bpDet}>
          {[
            { lbl: 'Flight',   val: 'DS-2024',  cls: 'c1' },
            { lbl: 'Stack',    val: 'SPARK',    cls: 'c2' },
            { lbl: 'Status',   val: 'LANDED',    cls: 'c3' },
            { lbl: 'Impact',   val: '$500K+',    cls: ''   },
            { lbl: 'Gate',     val: 'AI-01',     cls: 'c1' },
            { lbl: 'Role',     val: 'DEV II',    cls: 'c2' },
          ].map((d, i) => (
            <div key={d.lbl}>
              <div className={styles.bpDLbl}>{d.lbl}</div>
              <div className={`${styles.bpDVal} ${d.cls === 'c1' ? styles.bpDValC1 : d.cls === 'c2' ? styles.bpDValC2 : d.cls === 'c3' ? styles.bpDValC3 : ''}`}><Flap delay={1.1 + i * 0.08}>{d.val}</Flap></div>
            </div>
          ))}
        </div>

        {/* Passenger */}
        <div className={styles.bpPax}>
          <div>
            <div className={styles.bpPaxLbl}>PROFILE</div>
            <div className={styles.bpPaxName}>PRODUCTION AI</div>
            <div className={styles.bpPaxRole}>AI Developer II · Intact</div>
          </div>
          <div className={styles.bpSeat}>
            <div className={styles.bpSeatLbl}>SEAT</div>
            <div className={styles.bpSeatNum}><Flap delay={1.6}>01A</Flap></div>
          </div>
        </div>

        {/* Barcode */}
        <div className={styles.bpBar}>
          <div className={styles.bpBarcode}>
            <canvas id="bp-barcode" width="82" height="42" />
            <motion.span className={styles.bpScan} style={{ left: scanX, opacity: scanOpacity }} />
          </div>
          <div>
            <div className={styles.bpBarId}>SYSTEM ID</div>
            <div className={styles.bpBarNum}>AI-PLATFORM-01</div>
            <div className={`${styles.bpBarStatus} ${boarded ? styles.bpBarStatusOn : ''}`}>
              <div className={styles.bpBarDot} />
              <TextScramble as="span" duration={0.5} speed={0.03}>
                {boarded ? 'SCANNED · NOW BOARDING ✓' : 'GATE OPEN · SCROLL TO BOARD'}
              </TextScramble>
            </div>
          </div>
        </div>
      </div>

      {/* Stub — tears off along the perforation as you scroll */}
      <motion.div
        className={styles.bpStub}
        style={{ y: stubY, x: stubX, rotate: stubRotate, opacity: stubOpacity }}
      >
        <div>
          <div className={styles.bpStubRoute}>DATA → DECISION</div>
          <div className={styles.bpStubInfo}>INTACT FINANCIAL · 3+ YRS · AI DEVELOPER</div>
        </div>
        <div>
          <div className={styles.bpGateLbl}>GATE</div>
          <div className={styles.bpGateNum}>∞</div>
        </div>
      </motion.div>
      </div>
      </motion.div>
    </motion.div>
  )
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [.16,1,.3,1] },
})

export default function Hero() {
  const heroRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const textY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, -90])
  const textOpacity = useTransform(scrollYProgress, [0.25, 0.85], [1, 0])
  const textBlur = useTransform(scrollYProgress, [0.25, 0.85], reduce ? ['blur(0px)', 'blur(0px)'] : ['blur(0px)', 'blur(8px)'])

  return (
    <section className={styles.hero} id="home" ref={heroRef}>
      {/* Left text */}
      <motion.div className={styles.left} style={{ y: textY, opacity: textOpacity, filter: textBlur }}>
        <motion.div className={styles.eyebrow} {...fadeUp(.3)}>
          Interactive Career Story
        </motion.div>

        <div className={styles.nameWrap}>
          <div className={styles.nameGhost} aria-hidden>Dharmik<br />Soni</div>
          <h1 className={styles.name} aria-label="Dharmik Soni">
            <TextEffect as="span" per="char" preset="fade-in-blur" delay={0.35} speedReveal={0.9} speedSegment={0.6} className={styles.nameLine}>
              Dharmik
            </TextEffect>
            <TextEffect as="span" per="char" preset="fade-in-blur" delay={0.6} speedReveal={0.9} speedSegment={0.6} className={styles.nameLine}>
              Soni
            </TextEffect>
          </h1>
        </div>

        <motion.div className={styles.tagline} {...fadeUp(.58)}>
          AI Developer II
        </motion.div>
        <motion.div className={styles.company} {...fadeUp(.65)}>
          Intact Financial Corporation
        </motion.div>

        <motion.p className={styles.desc} {...fadeUp(.8)}>
          AI Developer II building production-grade data and ML systems at{' '}
          <strong>Intact Financial</strong>, with work spanning Kafka streaming,
          Databricks, Spark optimization, model lifecycle governance, and
          enterprise-scale AI delivery.
        </motion.p>

        <motion.div className={styles.ctas} {...fadeUp(.92)}>
          <a href="#journey" className="btn-p">Start Story →</a>
          <a href="#impact" className="btn-g">View Impact</a>
          <a href="https://github.com/Dharmik2510" target="_blank" rel="noreferrer" className="btn-g">GitHub ↗</a>
        </motion.div>
      </motion.div>

      {/* Right — boarding pass */}
      <div className={styles.right}>
        <BoardingPass progress={scrollYProgress} />
      </div>
    </section>
  )
}
