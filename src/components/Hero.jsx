// ─────────────────────────────────────────────────────────────────────────────
// HERO — an opening title sequence.
// The section pins for ~2.5 screens. As you scroll:
//   1. the intro text steps aside and the ticket moves to centre stage
//   2. the barcode is scanned, the pass is stamped DEPARTED
//   3. the passenger stub tears off
//   4. the camera pushes through the ticket and the letterbox closes → Journey film
// Subtitles narrate the moment. On load, a letterbox curtain opens.
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  AnimatePresence, animate, motion, useMotionValue, useMotionValueEvent,
  useReducedMotion, useScroll, useTransform,
} from 'framer-motion'
import { TextEffect, TextScramble, TextShimmer } from './motion-primitives'
import styles from './Hero.module.css'

const TICKET = {
  from: { code: 'AMD', city: 'Ahmedabad', country: 'India', lat: 23.03, lon: 72.58 },
  to: { code: 'YHZ', city: 'Halifax', country: 'Canada', lat: 44.65, lon: -63.59 },
  passenger: 'SONI / DHARMIK',
  passengerLocal: 'ધાર્મિક સોની',
  date: '07 SEP 2021',
  onward: ['YUL', 'YYZ'],
}

function km(a, b) {
  const R = 6371, r = Math.PI / 180
  const h = Math.sin(((b.lat - a.lat) * r) / 2) ** 2
    + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(((b.lon - a.lon) * r) / 2) ** 2
  return Math.round((2 * R * Math.asin(Math.sqrt(h))) / 10) * 10
}
const DISTANCE = km(TICKET.from, TICKET.to).toLocaleString('en-CA')

const CAPTIONS = [
  { from: 0.03, to: 0.24, text: 'Ahmedabad · 7 September 2021' },
  { from: 0.27, to: 0.47, text: 'A one-way ticket to Halifax.' },
  { from: 0.51, to: 0.74, text: `${DISTANCE} km from home.` },
  { from: 0.78, to: 0.97, text: 'Boarding.' },
]

const Flap = ({ children, delay = 0 }) => {
  const [go, setGo] = useState(false)
  useEffect(() => { const t = setTimeout(() => setGo(true), delay * 1000); return () => clearTimeout(t) }, [delay])
  return <TextScramble as="span" trigger={go} duration={0.8} speed={0.04}>{children}</TextScramble>
}

function Barcode() {
  const bars = []
  const seed = 'SONIDHARMIKAMDYHZ07SEP21'
  let x = 0
  for (let i = 0; i < 46; i++) {
    const c = seed.charCodeAt(i % seed.length) + i
    const w = c % 3 === 0 ? 2 : 1
    bars.push({ x, w })
    x += w + (c % 5 === 0 ? 2 : 1)
  }
  return (
    <svg className={styles.barcode} viewBox={`0 0 ${x} 40`} preserveAspectRatio="none" aria-hidden="true">
      {bars.map((b, i) => <rect key={i} x={b.x} y="0" width={b.w} height="40" />)}
    </svg>
  )
}

function Caption({ p, from, to, children }) {
  const opacity = useTransform(p, [from, from + 0.035, to - 0.035, to], [0, 1, 1, 0])
  const y = useTransform(p, [from, from + 0.05], [12, 0])
  const filter = useTransform(p, [from, from + 0.04, to - 0.03, to], ['blur(6px)', 'blur(0px)', 'blur(0px)', 'blur(6px)'])
  return <motion.p className={styles.caption} style={{ opacity, y, filter }}>{children}</motion.p>
}

export default function Hero() {
  const reduce = useReducedMotion()
  const heroRef = useRef(null)
  const stageRef = useRef(null)
  const passRef = useRef(null)
  const tiltRef = useRef(null)
  const [delta, setDelta] = useState({ x: 0, y: 0, s: 1.15 })

  const { scrollYProgress: p } = useScroll({ target: heroRef, offset: ['start start', 'end end'] })
  const still = (v) => (reduce ? [v[0], v[0]] : v)

  // ── measure how far the ticket must travel to reach centre stage ──
  useLayoutEffect(() => {
    const measure = () => {
      const st = stageRef.current, el = passRef.current
      if (!st || !el) return
      const a = st.getBoundingClientRect(), b = el.getBoundingClientRect()
      const narrow = window.innerWidth < 1024
      const fit = Math.min(1.18, (a.height * 0.72) / b.height, (a.width * 0.86) / b.width)
      setDelta({
        x: a.left + a.width / 2 - (b.left + b.width / 2),
        y: a.top + a.height / 2 - (b.top + b.height / 2) - (narrow ? 10 : 0),
        s: Math.max(0.8, fit),
      })
    }
    measure()
    const t = setTimeout(measure, 2800) // after the intro animation settles
    window.addEventListener('resize', measure)
    return () => { clearTimeout(t); window.removeEventListener('resize', measure) }
  }, [])

  // ── scroll choreography ──
  const textOpacity = useTransform(p, [0.02, 0.16], [1, 0])
  const textX = useTransform(p, [0.02, 0.2], still([0, -80]))
  const textFilter = useTransform(p, [0.02, 0.16], reduce ? ['none', 'none'] : ['blur(0px)', 'blur(10px)'])

  const moveX = useTransform(p, [0.04, 0.24], still([0, delta.x]))
  const moveY = useTransform(p, [0.04, 0.24], still([0, delta.y]))
  const pushScale = useTransform(p, [0.04, 0.24, 0.8, 1], reduce ? [1, 1, 1, 1] : [1, delta.s, delta.s, delta.s * 3.4])
  const passRotate = useTransform(p, [0.04, 0.24], still([-2.5, 0]))
  const passOpacity = useTransform(p, [0.86, 0.97], [1, 0])

  const scanX = useTransform(p, [0.26, 0.4], ['-6%', '106%'])
  const scanOpacity = useTransform(p, [0.25, 0.27, 0.39, 0.41], [0, 1, 1, 0])
  const stubY = useTransform(p, [0.52, 0.74], still([0, 240]))
  const stubX = useTransform(p, [0.52, 0.74], still([0, 40]))
  const stubRotate = useTransform(p, [0.52, 0.74], still([0, 16]))
  const stubOpacity = useTransform(p, [0.64, 0.76], [1, 0])

  const bgFilter = useTransform(p, [0, 0.3, 1], reduce
    ? ['blur(18px) brightness(.42)', 'blur(18px) brightness(.42)', 'blur(18px) brightness(.42)']
    : ['blur(18px) brightness(.42) saturate(.9)', 'blur(12px) brightness(.5) saturate(1)', 'blur(0px) brightness(.9) saturate(1.1)'])
  const bgScale = useTransform(p, [0, 1], still([1.12, 1]))
  const bgOpacity = useTransform(p, [0, 0.4, 1], [0.55, 0.7, 1])

  // letterbox: curtain opens on load, widescreen bars while pinned, closes to black at the end
  const open = useMotionValue(reduce ? 1 : 0)
  useEffect(() => {
    if (reduce) return
    const c = animate(open, 1, { duration: 1.6, delay: 0.15, ease: [0.7, 0, 0.2, 1] })
    return () => c.stop()
  }, [open, reduce])
  const barH = useTransform([open, p], ([o, v]) => {
    const band = v < 0.04 ? 0 : v < 0.18 ? ((v - 0.04) / 0.14) * 8 : v < 0.92 ? 8 : 8 + ((v - 0.92) / 0.08) * 42
    return `${Math.max((1 - o) * 50, reduce ? 0 : Math.min(50, band))}vh`
  })
  const hintOpacity = useTransform(p, [0, 0.03], [1, 0])

  // discrete story beats
  const [beat, setBeat] = useState({ boarded: false, stamped: false })
  useMotionValueEvent(p, 'change', (v) => {
    const boarded = v > 0.38, stamped = v > 0.44
    setBeat((b) => (b.boarded === boarded && b.stamped === stamped ? b : { boarded, stamped }))
    const film = v > 0.02 && v < 0.999
    document.documentElement.toggleAttribute('data-film', film)
  })
  useEffect(() => () => document.documentElement.removeAttribute('data-film'), [])

  // gentle tilt toward the pointer
  useEffect(() => {
    const card = tiltRef.current
    if (!card || reduce) return
    const onMove = (e) => {
      const r = card.getBoundingClientRect()
      const dx = (e.clientX - r.left - r.width / 2) / r.width
      const dy = (e.clientY - r.top - r.height / 2) / r.height
      card.style.transform = `rotateX(${-dy * 5}deg) rotateY(${dx * 5}deg)`
      card.style.transition = 'transform .12s ease'
    }
    const onLeave = () => {
      card.style.transform = 'rotateX(0deg) rotateY(0deg)'
      card.style.transition = 'transform .8s cubic-bezier(.16,1,.3,1)'
    }
    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseleave', onLeave)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseleave', onLeave)
    }
  }, [reduce])

  return (
    <section className={`${styles.hero} ${reduce ? '' : styles.pinned}`} id="home" ref={heroRef}>
      <div className={styles.stage} ref={stageRef}>
        {/* Ahmedabad at dusk — sharpens as the camera pushes in */}
        <motion.div
          className={styles.backdrop}
          style={{ filter: bgFilter, scale: bgScale, opacity: bgOpacity }}
          aria-hidden="true"
        />
        <div className={styles.grain} aria-hidden="true" />

        <div className={styles.grid}>
          <motion.div className={styles.left} style={{ opacity: textOpacity, x: textX, filter: textFilter }}>
            <motion.div
              className={styles.eyebrow}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 1.1, ease: [.16, 1, .3, 1] }}
            >
              Ahmedabad → Halifax → Montréal → Toronto
            </motion.div>

            <h1 className={styles.name} aria-label="Dharmik Soni">
              <TextEffect as="span" per="char" preset="fade-in-blur" delay={1.2} speedReveal={0.9} speedSegment={0.6} className={styles.nameLine}>
                Dharmik
              </TextEffect>
              <TextEffect as="span" per="char" preset="fade-in-blur" delay={1.45} speedReveal={0.9} speedSegment={0.6} className={styles.nameLine}>
                Soni
              </TextEffect>
            </h1>

            <motion.p
              className={styles.lede}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.8, ease: [.16, 1, .3, 1] }}
            >
              I left home on a one-way ticket in September 2021.
            </motion.p>

            <motion.p
              className={styles.desc}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.95, ease: [.16, 1, .3, 1] }}
            >
              Three Canadian cities later, I'm an AI Developer II at <strong>Intact Financial</strong>, building
              the Kafka streaming pipelines behind usage-based insurance and tuning Spark on Databricks, work that
              has saved <strong>$500K+</strong> in operating costs.
            </motion.p>

            <motion.div
              className={styles.ctas}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 2.1, ease: [.16, 1, .3, 1] }}
            >
              <a href="#journey" className={styles.primary}>Start the journey <span aria-hidden="true">↓</span></a>
              <a href="#impact" className={styles.quiet}>See the impact</a>
              <a href="https://github.com/Dharmik2510" target="_blank" rel="noreferrer" className={styles.quiet}>GitHub ↗</a>
            </motion.div>
          </motion.div>

          <div className={styles.right}>
            <motion.div
              ref={passRef}
              className={styles.passWrap}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.3, delay: 1.3, ease: [.16, 1, .3, 1] }}
            >
              <motion.div
                className={styles.lift}
                style={{ x: moveX, y: moveY, scale: pushScale, rotate: passRotate, opacity: passOpacity }}
              >
                <div className={styles.shadow} />
                <div className={styles.tilt} ref={tiltRef}>
                  <article className={styles.pass} aria-label={`Boarding pass: ${TICKET.from.city} to ${TICKET.to.city}, one way, ${TICKET.date}`}>
                    <header className={styles.passHead}>
                      <span>Boarding pass</span>
                      <span className={styles.oneWay}>One way</span>
                    </header>

                    <div className={styles.route}>
                      <div className={styles.port}>
                        <span className={styles.code}><Flap delay={1.7}>{TICKET.from.code}</Flap></span>
                        <span className={styles.city}>{TICKET.from.city}</span>
                        <span className={styles.country}>{TICKET.from.country}</span>
                      </div>
                      <div className={styles.flight} aria-hidden="true">
                        <span className={styles.flightLine} />
                        <span className={styles.flightPlane}>✈</span>
                      </div>
                      <div className={`${styles.port} ${styles.portTo}`}>
                        <span className={styles.code}><Flap delay={1.85}>{TICKET.to.code}</Flap></span>
                        <span className={styles.city}>{TICKET.to.city}</span>
                        <span className={styles.country}>{TICKET.to.country}</span>
                      </div>
                    </div>

                    <dl className={styles.fields}>
                      <div className={styles.fieldWide}>
                        <dt>Passenger</dt>
                        <dd>{TICKET.passenger}<span className={styles.local} lang="gu">{TICKET.passengerLocal}</span></dd>
                      </div>
                      <div><dt>Date</dt><dd><Flap delay={2}>{TICKET.date}</Flap></dd></div>
                      <div><dt>Fare</dt><dd>One way</dd></div>
                      <div><dt>Onward</dt><dd>{TICKET.onward.join(' · ')}</dd></div>
                    </dl>

                    <div className={styles.scan}>
                      <div className={styles.barcodeWrap}>
                        <Barcode />
                        <motion.span className={styles.beam} style={{ left: scanX, opacity: scanOpacity }} />
                      </div>
                      <div className={`${styles.status} ${beat.boarded ? styles.statusOn : ''}`}>
                        <span className={styles.dot} />
                        <TextScramble as="span" duration={0.5} speed={0.03}>
                          {beat.boarded ? 'Scanned · boarding complete' : 'Scroll to board'}
                        </TextScramble>
                      </div>
                    </div>

                    <AnimatePresence>
                      {beat.stamped && (
                        <motion.div
                          className={styles.stamp}
                          initial={{ opacity: 0, scale: 2.6, rotate: -26 }}
                          animate={{ opacity: 0.9, scale: 1, rotate: -12 }}
                          exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                          transition={{ type: 'spring', stiffness: 520, damping: 22 }}
                          aria-hidden="true"
                        >
                          <span>Departed</span>
                          <b>AMD</b>
                          <span>07 · 09 · 2021</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </article>

                  <motion.div
                    className={styles.stub}
                    style={{ y: stubY, x: stubX, rotate: stubRotate, opacity: stubOpacity }}
                  >
                    <div>
                      <span className={styles.stubLabel}>Passenger copy</span>
                      <span className={styles.stubRoute}>AMD → YHZ → YUL → YYZ</span>
                    </div>
                    <span className={styles.stubDate}>07.09.21</span>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* subtitles */}
        {!reduce && (
          <div className={styles.captions} aria-hidden="true">
            {CAPTIONS.map((c) => <Caption key={c.text} p={p} from={c.from} to={c.to}>{c.text}</Caption>)}
          </div>
        )}

        {/* letterbox */}
        <motion.div className={`${styles.bar} ${styles.barTop}`} style={{ height: barH }} aria-hidden="true" />
        <motion.div className={`${styles.bar} ${styles.barBottom}`} style={{ height: barH }} aria-hidden="true" />

        {!reduce && (
          <motion.div className={styles.hint} style={{ opacity: hintOpacity }} aria-hidden="true">
            <TextShimmer as="span" duration={2.4}>Scroll</TextShimmer>
            <i />
          </motion.div>
        )}
      </div>
    </section>
  )
}
