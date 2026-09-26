// ─────────────────────────────────────────────────────────────────────────────
// Cinema kit — shared scroll effects for every section below the Journey film.
//   SmoothScroll   Lenis inertia scrolling (desktop), native on touch
//   FilmGrain      subtle animated film grain over the whole site
//   SectionHead    eyebrow scramble + masked title rise + giant drifting ghost word
//   ScrollWords    text that "lights up" word-by-word as you scroll through it
//   VelocityMarquee  departure-board ribbon whose speed follows your scroll speed
//   CountUp        numeric part of a stat counts up on first view
// ─────────────────────────────────────────────────────────────────────────────
import React, { useEffect, useRef, useState } from 'react'
import {
  motion, useScroll, useTransform, useInView, useReducedMotion,
  useMotionValue, useVelocity, useSpring, useAnimationFrame, animate,
} from 'framer-motion'
import Lenis from 'lenis'
import 'lenis/dist/lenis.css'
import { TextScramble } from '../motion-primitives'
import './cinema.css'

const EASE = [0.16, 1, 0.3, 1]

// ── Smooth scroll ──
export function SmoothScroll() {
  const reduce = useReducedMotion()
  useEffect(() => {
    if (reduce) return
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      autoRaf: true,
      anchors: { offset: -64 },
    })
    window.__lenis = lenis
    return () => { lenis.destroy(); delete window.__lenis }
  }, [reduce])
  return null
}

// ── Wide-screen check (pinned/horizontal layouts only on roomy screens) ──
export function useIsWide(query = '(min-width: 1024px) and (min-height: 640px)') {
  const [wide, setWide] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches)
  useEffect(() => {
    const m = window.matchMedia(query)
    const on = () => setWide(m.matches)
    on()
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [query])
  return wide
}

// ── Film grain ──
export function FilmGrain() {
  return <div className="cn-grain" aria-hidden="true" />
}

// ── Section heading ──
// title: array of { t: 'About', em?: true, br?: true }
export function SectionHead({ eyebrow, title, ghost, className = '', id }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -12% 0px' })
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const ghostX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['6%', '-30%'])
  const label = title.map((w) => w.t + (w.glue ? '' : ' ')).join('').trim()

  return (
    <header ref={ref} className={`cn-head ${className}`}>
      {ghost && (
        <motion.div className="cn-ghost" style={{ x: ghostX }} aria-hidden="true">
          {ghost}
        </motion.div>
      )}
      <motion.p
        className="cn-kicker"
        initial={reduce ? false : { opacity: 0, y: 10, filter: 'blur(6px)' }}
        animate={inView ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
        transition={{ duration: 0.9, ease: EASE }}
      >
        {eyebrow}
      </motion.p>
      <h2 className="s-title cn-title" id={id} aria-label={label}>
        {title.map((w, i) => {
          const word = (
            <motion.span
              className="cn-rise"
              initial={reduce ? false : { y: '110%', rotate: 3 }}
              animate={inView ? { y: '0%', rotate: 0 } : undefined}
              transition={{ duration: 1.05, delay: 0.08 + i * 0.09, ease: EASE }}
            >
              {w.t}
            </motion.span>
          )
          return (
            <React.Fragment key={i}>
              <span className="cn-mask" aria-hidden="true">{w.em ? <em>{word}</em> : word}</span>
              {w.br ? <br /> : w.glue ? null : ' '}
            </React.Fragment>
          )
        })}
      </h2>
    </header>
  )
}

// ── Scroll-lit paragraph ──
// Accepts a string with optional <strong>…</strong> spans.
function tokenize(html) {
  const out = []
  html.split(/(<strong>.*?<\/strong>)/g).forEach((chunk) => {
    const bold = chunk.startsWith('<strong>')
    const text = chunk.replace(/<\/?strong>/g, '')
    text.split(/\s+/).filter(Boolean).forEach((w) => out.push({ w, bold }))
  })
  return out
}

function Word({ children, progress, range, bold }) {
  const opacity = useTransform(progress, range, [0.16, 1])
  const Tag = bold ? motion.strong : motion.span
  return <Tag className="cn-word" style={{ opacity }}>{children}</Tag>
}

export function ScrollWords({ html, className = '' }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.88', 'end 0.52'] })
  const words = tokenize(html)
  if (reduce) {
    return <p className={className}>{words.map((t, i) => { const sp = words[i + 1] && /^[,.;:!?)]/.test(words[i + 1].w) ? '' : ' '; return t.bold ? <React.Fragment key={i}><strong>{t.w}</strong>{sp}</React.Fragment> : `${t.w}${sp}` })}</p>
  }
  return (
    <p ref={ref} className={className}>
      {words.map((t, i) => (
        <React.Fragment key={i}>
          <Word progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]} bold={t.bold}>
            {t.w}
          </Word>{words[i + 1] && /^[,.;:!?)]/.test(words[i + 1].w) ? '' : ' '}
        </React.Fragment>
      ))}
    </p>
  )
}

// ── Velocity marquee (speeds up / reverses with scroll velocity) ──
const wrap = (min, max, v) => { const r = max - min; return ((((v - min) % r) + r) % r) + min }

export function VelocityMarquee({ items, baseVelocity = -2.2, className = '' }) {
  const reduce = useReducedMotion()
  const baseX = useMotionValue(0)
  const { scrollY } = useScroll()
  const velocity = useVelocity(scrollY)
  const smoothV = useSpring(velocity, { damping: 50, stiffness: 380 })
  const factor = useTransform(smoothV, [0, 1000], [0, 4], { clamp: false })
  const x = useTransform(baseX, (v) => `${wrap(-25, 0, v)}%`)
  const dir = useRef(1)

  useAnimationFrame((_, delta) => {
    if (reduce) return
    let move = dir.current * baseVelocity * (delta / 1000)
    const f = factor.get()
    if (f < 0) dir.current = -1
    else if (f > 0) dir.current = 1
    move += dir.current * move * f
    baseX.set(baseX.get() + move)
  })

  const row = (
    <span className="cn-marquee-row">
      {items.map((it, i) => (
        <span key={i} className="cn-marquee-item">{it}<i aria-hidden="true">✈</i></span>
      ))}
    </span>
  )
  return (
    <div className={`cn-marquee ${className}`} aria-label={items.join(' · ')}>
      <motion.div className="cn-marquee-track" style={{ x }} aria-hidden="true">
        {row}{row}{row}{row}
      </motion.div>
    </div>
  )
}

// ── Count-up for stat values like "$500K+" or "3+ yrs" ──
export function CountUp({ value, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '0px 0px -10% 0px' })
  const m = String(value).match(/^(\D*)(\d+)(.*)$/)
  const [n, setN] = useState(m ? 0 : null)
  useEffect(() => {
    if (!m || !inView) return
    const target = Number(m[2])
    const c = animate(0, target, { duration: 1.6, ease: EASE, onUpdate: (v) => setN(Math.round(v)) })
    return () => c.stop()
  }, [inView]) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <span ref={ref} className={className}>
      {m ? `${m[1]}${n}${m[3]}` : value}
    </span>
  )
}

// ── Reveal presets shared by cards ──
export const revealUp = (i = 0) => ({
  initial: { opacity: 0, y: 70, rotateX: 14, filter: 'blur(10px)' },
  whileInView: { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '0px 0px -10% 0px' },
  transition: { duration: 1, delay: i * 0.08, ease: EASE },
})

export const revealSide = (i = 0, from = 80) => ({
  initial: { opacity: 0, x: from, filter: 'blur(10px)' },
  whileInView: { opacity: 1, x: 0, filter: 'blur(0px)' },
  viewport: { once: true, margin: '0px 0px -12% 0px' },
  transition: { duration: 1, delay: i * 0.07, ease: EASE },
})
