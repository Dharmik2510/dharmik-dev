// ─────────────────────────────────────────────────────────────────────────────
// PASSAGE — the Journey section as one continuous, scroll-driven film.
//
// • Scroll drives *time*: each city's footage is scrubbed frame-by-frame with the
//   scroll position (technique ported from scroll-world's scrub engine —
//   github.com/oso95/scroll-world: blob-loaded clips, lerped currentTime,
//   coalesced seeks, linger easing, lazy loading around the viewport).
// • Between cities the film closes into an aircraft window: the city shrinks into
//   a porthole, you fly through the clouds, and the next city opens back up.
// • Text is animated with motion-primitives (TextEffect, TextScramble,
//   SlidingNumber, TextShimmer, ProgressiveBlur).
// ─────────────────────────────────────────────────────────────────────────────
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, useMotionValueEvent } from 'framer-motion'
import { CHAPTERS } from '../data/journey'
import { WAYPOINTS } from '../data'
import {
  TextEffect, TextScramble, SlidingNumber, TextShimmer, ProgressiveBlur,
} from './motion-primitives'
import '../styles/passage.css'

// ── timeline (in viewport heights of scroll) ──
const DIVE = 1.5     // time spent in each city
const FLIGHT = 1.0   // time spent flying between cities
const LINGER = 0.35  // camera settles mid-city where the copy peaks (scroll-world "linger")
const INTRO_END = 0.2 // fraction of the first city covered by the title card

const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x))
const smooth = (x) => { x = clamp(x); return x * x * (3 - 2 * x) }
const lerp = (a, b, t) => a + (b - a) * t
const lingerEase = (x, L) => { const c = x - 0.5; return (1 - L) * x + L * (4 * c * c * c + 0.5) }

function haversineKm(a, b) {
  const R = 6371, rad = Math.PI / 180
  const dLat = (b.lat - a.lat) * rad, dLon = (b.lon - a.lon) * rad
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * rad) * Math.cos(b.lat * rad) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(h))
}

// Build the segment chain once: dive0, flight0, dive1, … dive3
const SEGMENTS = (() => {
  const out = []
  let off = 0
  CHAPTERS.forEach((c, i) => {
    out.push({ kind: 'dive', i, start: off, end: off + DIVE }); off += DIVE
    if (i < CHAPTERS.length - 1) { out.push({ kind: 'flight', i, start: off, end: off + FLIGHT }); off += FLIGHT }
  })
  return out
})()
const TOTAL = SEGMENTS[SEGMENTS.length - 1].end

const LEGS = CHAPTERS.slice(1).map((c, i) => Math.round(haversineKm(CHAPTERS[i], c)))
const CUM = LEGS.reduce((acc, d) => [...acc, acc[acc.length - 1] + d], [0])
const TOTAL_KM = CUM[CUM.length - 1]

const DESC = Object.fromEntries(WAYPOINTS.map((w) => [w.code, w]))

// ── helpers ──
function useReducedMotion() {
  const [r, setR] = useState(false)
  useEffect(() => {
    const m = window.matchMedia('(prefers-reduced-motion: reduce)')
    setR(m.matches)
    const on = () => setR(m.matches)
    m.addEventListener?.('change', on)
    return () => m.removeEventListener?.('change', on)
  }, [])
  return r
}

function localTime(tz) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: tz, hour: '2-digit', minute: '2-digit', hour12: false })
    .formatToParts(new Date())
  const get = (t) => Number(parts.find((p) => p.type === t)?.value || 0)
  return { h: get('hour') % 24, m: get('minute') }
}

function tzAbbr(tz) {
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
      .formatToParts(new Date()).find((p) => p.type === 'timeZoneName')?.value || ''
  } catch { return '' }
}
const TZ_LABEL = (tz) => (tz === 'Asia/Kolkata' ? 'IST' : tzAbbr(tz))

// Odometer that subscribes to a motion value, so only this tiny component re-renders
function KmCounter({ mv }) {
  const [v, setV] = useState(0)
  useMotionValueEvent(mv, 'change', (x) => {
    const r = Math.round(x / 10) * 10
    setV((prev) => (prev === r ? prev : r))
  })
  return <SlidingNumber value={v} />
}

function Clock({ tz }) {
  const [t, setT] = useState(() => localTime(tz))
  useEffect(() => {
    setT(localTime(tz))
    const id = setInterval(() => setT(localTime(tz)), 20000)
    return () => clearInterval(id)
  }, [tz])
  return (
    <span className="psg-clock">
      <SlidingNumber value={t.h} padStart={2} />
      <span className="psg-clock-colon">:</span>
      <SlidingNumber value={t.m} padStart={2} />
      <span className="psg-clock-tz">{TZ_LABEL(tz)}</span>
    </span>
  )
}

const fmtLat = (v) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? 'N' : 'S'}`
const fmtLon = (v) => `${Math.abs(v).toFixed(2)}°${v >= 0 ? 'E' : 'W'}`

// Passport stamp — thuds in when you land in a city
const STAMP_POS = [
  { x: 0, y: 0, r: -9 },
  { x: -52, y: -96, r: 7 },
  { x: 14, y: -186, r: -4 },
  { x: -40, y: -276, r: 10 },
]
function Stamp({ chapter, index, current }) {
  const p = STAMP_POS[index]
  return (
    <motion.div
      className={`psg-stamp${current ? ' is-current' : ''}`}
      style={{ '--ink': chapter.accent, '--sx': `${p.x}px`, '--sy': `${p.y}px` }}
      initial={{ opacity: 0, scale: 2.4, rotate: p.r - 14 }}
      animate={{ opacity: 1, scale: 1, rotate: p.r }}
      exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 520, damping: 24, mass: 0.9 }}
    >
      <span className="psg-stamp-badge">{chapter.badge}</span>
      <span className="psg-stamp-code">{chapter.code}</span>
      <span className="psg-stamp-city">{chapter.city.toUpperCase()} · CH {chapter.chapter}</span>
    </motion.div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
export default function Passage() {
  const reduce = useReducedMotion()
  const sectionRef = useRef(null)
  const stickyRef = useRef(null)
  const sceneRefs = useRef([])
  const videoRefs = useRef([])
  const skyRef = useRef(null)
  const windowRef = useRef(null)
  const cabinRef = useRef(null)
  const introRef = useRef(null)
  const copyRef = useRef(null)
  const fillRef = useRef(null)
  const planeRef = useRef(null)
  const routePlaneRef = useRef(null)
  const latRef = useRef(null)
  const lonRef = useRef(null)
  const hintRef = useRef(null)

  const kmMV = useMotionValue(0)
  const [blobs, setBlobs] = useState(() => CHAPTERS.map(() => null))
  const [painted, setPainted] = useState(() => CHAPTERS.map(() => false))
  const [state, setState] = useState({ active: 0, phase: 'intro', leg: 0 })

  // mutable per-frame state
  const m = useRef({
    H: 0, W: 0, laidW: 0, top: 0, mobile: false, coarse: false,
    loading: CHAPTERS.map(() => false),
    ready: CHAPTERS.map(() => false),
    cur: CHAPTERS.map(() => 0),
    target: CHAPTERS.map(() => 0),
    visible: CHAPTERS.map((_, i) => i === 0),
    raf: 0, ticking: false,
  })

  const segEdges = useMemo(() => SEGMENTS.map((s) => ({ ...s })), [])

  // ── lazy blob loading (always seekable, no byte-range dependence) ──
  const loadClip = useCallback((i) => {
    const st = m.current
    if (reduce || st.loading[i]) return
    st.loading[i] = true
    const c = CHAPTERS[i]
    const url = st.mobile && c.scrubSrcMobile ? c.scrubSrcMobile : c.scrubSrc
    fetch(url)
      .then((r) => (r.ok ? r.blob() : Promise.reject(new Error(String(r.status)))))
      .then((b) => {
        const u = URL.createObjectURL(b)
        setBlobs((prev) => { const n = [...prev]; n[i] = u; return n })
      })
      .catch(() => { st.loading[i] = false })
  }, [reduce])

  useEffect(() => () => blobs.forEach((u) => u && URL.revokeObjectURL(u)), []) // eslint-disable-line

  // ── layout ──
  const layout = useCallback(() => {
    const st = m.current
    const sticky = stickyRef.current
    const section = sectionRef.current
    if (!sticky || !section) return
    st.H = sticky.clientHeight || window.innerHeight
    st.W = sticky.clientWidth || window.innerWidth
    st.laidW = window.innerWidth
    st.mobile = st.coarse || window.innerWidth <= 860
    section.style.height = `${(TOTAL + 1) * st.H}px`
  }, [])

  // ── per-scroll read: map scroll → segment → styles ──
  const read = useCallback(() => {
    const st = m.current
    st.ticking = false
    const section = sectionRef.current
    if (!section || !st.H) return
    const H = st.H, W = st.W
    const y = clamp(-section.getBoundingClientRect().top, 0, TOTAL * H) / H // in vh units
    const rect = section.getBoundingClientRect()
    const inRange = rect.bottom > 0 && rect.top < H
    // film fills the screen → tuck away the fixed bottom strip
    const filling = rect.top <= 1 && rect.bottom >= H - 1
    if (st.filling !== filling) {
      st.filling = filling
      document.documentElement.toggleAttribute('data-passage', filling)
    }

    let seg = segEdges[0]
    for (const s of segEdges) if (y >= s.start) seg = s
    const local = clamp((y - seg.start) / (seg.end - seg.start))

    // preload clips within ~1.6 screens
    if (inRange || Math.abs(rect.top) < 2 * H) {
      segEdges.forEach((s) => {
        if (s.kind === 'dive' && y > s.start - 1.6 && y < s.end + 1.6) loadClip(s.i)
      })
    }

    const op = CHAPTERS.map(() => 0)
    let win = 0, sky = 0, active = 0, phase = 'land', leg = 0
    let lat, lon, km

    if (seg.kind === 'dive') {
      const i = seg.i
      active = i
      op[i] = 1
      CHAPTERS.forEach((_, k) => { st.target[k] = k < i ? 1 : k > i ? 0 : lingerEase(local, LINGER) })
      if (i === 0 && local < INTRO_END) phase = 'intro'
      lat = CHAPTERS[i].lat; lon = CHAPTERS[i].lon; km = CUM[i]
    } else {
      const i = seg.i, f = local
      leg = i
      active = f < 0.5 ? i : i + 1
      phase = 'flight'
      CHAPTERS.forEach((_, k) => { st.target[k] = k <= i ? 1 : 0 })
      if (reduce) {
        op[i] = 1 - smooth(f); op[i + 1] = smooth(f)
      } else {
        win = smooth(f / 0.28) * (1 - smooth((f - 0.72) / 0.28))
        op[i] = 1 - smooth((f - 0.36) / 0.1)
        op[i + 1] = smooth((f - 0.54) / 0.1)
        sky = smooth((f - 0.32) / 0.12) * (1 - smooth((f - 0.56) / 0.12))
      }
      const t = smooth((f - 0.2) / 0.6)
      lat = lerp(CHAPTERS[i].lat, CHAPTERS[i + 1].lat, t)
      lon = lerp(CHAPTERS[i].lon, CHAPTERS[i + 1].lon, t)
      km = CUM[i] + LEGS[i] * t
      if (routePlaneRef.current) {
        routePlaneRef.current.style.offsetDistance = `${(t * 100).toFixed(2)}%`
      }
    }

    // scenes
    CHAPTERS.forEach((_, k) => {
      const el = sceneRefs.current[k]
      if (!el) return
      el.style.opacity = op[k]
      st.visible[k] = op[k] > 0.001
      el.style.visibility = op[k] > 0.001 ? 'visible' : 'hidden'
    })
    if (skyRef.current) {
      skyRef.current.style.opacity = sky
      skyRef.current.style.setProperty('--f', seg.kind === 'flight' ? local : 0)
    }

    // aircraft window: interpolate from full-bleed to porthole
    if (windowRef.current) {
      const pw = st.mobile ? Math.min(W * 0.62, 280) : Math.min(H * 0.42, 360)
      const ph = pw * 1.4
      const w = lerp(W + 4, pw, win), h = lerp(H + 4, ph, win)
      const r = lerp(0, pw * 0.44, win)
      const ring = 20 * win
      const s = windowRef.current.style
      s.width = `${w}px`; s.height = `${h}px`
      s.borderRadius = `${r}px`
      s.boxShadow = win > 0.001
        ? `inset 0 0 ${40 * win}px rgba(0,0,0,${0.55 * win}), 0 0 0 ${ring}px #c9ced4, 0 0 0 ${ring + 2}px #8d96a0, 0 0 ${60 * win}px ${ring + 8}px rgba(0,0,0,.6), 0 0 0 200vmax #0b0a0c`
        : 'none'
      s.setProperty('--win', win)
      s.visibility = win > 0.001 ? 'visible' : 'hidden'
      if (stickyRef.current) stickyRef.current.style.setProperty('--zoom', (1 + 0.1 * win).toFixed(4))
    }
    if (cabinRef.current) cabinRef.current.style.opacity = smooth((win - 0.55) / 0.35)

    // intro title card
    if (introRef.current) {
      const io = seg.kind === 'dive' && seg.i === 0 ? 1 - smooth(local / INTRO_END) : 0
      introRef.current.style.opacity = io
      introRef.current.style.transform = reduce ? 'none' : `translateY(${(-(1 - io) * 6).toFixed(2)}vh)`
      introRef.current.style.pointerEvents = io > 0.5 ? 'auto' : 'none'
    }
    if (hintRef.current) hintRef.current.style.opacity = y < 0.05 ? 1 : 1 - smooth(y / 0.2)

    // copy parallax within a city
    if (copyRef.current && seg.kind === 'dive' && !reduce) {
      copyRef.current.style.transform = `translateY(${((0.5 - local) * 5).toFixed(2)}vh)`
    }

    // HUD
    if (latRef.current) latRef.current.textContent = fmtLat(lat)
    if (lonRef.current) lonRef.current.textContent = fmtLon(lon)
    kmMV.set(km)

    // route progress bar (nodes sit at dive midpoints)
    const frac = clamp(y / TOTAL)
    if (fillRef.current) fillRef.current.style.transform = `scaleX(${frac})`
    if (planeRef.current) planeRef.current.style.left = `${frac * 100}%`

    setState((prev) => (prev.active === active && prev.phase === phase && prev.leg === leg
      ? prev : { active, phase, leg }))
  }, [segEdges, loadClip, reduce, kmMV])

  // ── scrub loop: lerp towards target, never queue a seek while seeking ──
  useEffect(() => {
    if (reduce) return
    const st = m.current
    const tick = () => {
      const eps = st.mobile ? 0.02 : 0.008
      for (let k = 0; k < CHAPTERS.length; k++) {
        const v = videoRefs.current[k]
        if (!v || !st.ready[k] || v.seeking) continue
        if (!st.visible[k] && Math.abs(st.cur[k] - st.target[k]) < 0.002) continue
        st.cur[k] += (st.target[k] - st.cur[k]) * 0.18
        const t = clamp(st.cur[k], 0, 0.999) * (v.duration || 1)
        if (Math.abs(v.currentTime - t) > eps) { try { v.currentTime = t } catch { /* noop */ } }
      }
      st.raf = requestAnimationFrame(tick)
    }
    st.raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(st.raf)
  }, [reduce])

  useEffect(() => {
    const st = m.current
    st.coarse = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    layout(); read()
    const onScroll = () => { if (!st.ticking) { st.ticking = true; requestAnimationFrame(read) } }
    const onResize = () => {
      // phones fire resize when the URL bar slides; only relayout on width change
      if (st.coarse && window.innerWidth === st.laidW) return
      layout(); read()
    }
    // iOS: prime loaded clips on first touch so the first seek paints
    const prime = () => videoRefs.current.forEach((v) => {
      if (!v) return
      try { const p = v.play(); p?.then?.(() => v.pause()).catch(() => {}) } catch { /* noop */ }
    })
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onResize)
    window.addEventListener('orientationchange', onResize)
    window.addEventListener('touchstart', prime, { once: true, passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('orientationchange', onResize)
      window.removeEventListener('touchstart', prime)
      document.documentElement.removeAttribute('data-passage')
    }
  }, [layout, read])

  const jumpTo = (i) => {
    const section = sectionRef.current
    if (!section) return
    const s = segEdges.find((x) => x.kind === 'dive' && x.i === i)
    const top = section.getBoundingClientRect().top + window.scrollY
    const y = top + (s.start + DIVE * 0.5) * m.current.H
    if (window.__lenis && !reduce) window.__lenis.scrollTo(y, { duration: 1.6 })
    else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' })
  }

  const { active, phase, leg } = state
  const chapter = CHAPTERS[active]
  const info = DESC[chapter.code] || {}
  const landed = phase === 'land'
  const from = CHAPTERS[leg], to = CHAPTERS[leg + 1] || CHAPTERS[leg]

  return (
    <section id="journey" ref={sectionRef} className="psg" aria-label="Journey: Ahmedabad to Toronto">
      <div ref={stickyRef} className="psg-sticky" data-phase={phase} style={{ '--accent': chapter.accent }}>
        {/* ── the film ── */}
        <div className="psg-stage">
          {CHAPTERS.map((c, i) => (
            <div
              key={c.id}
              ref={(el) => { sceneRefs.current[i] = el }}
              className={`psg-scene${painted[i] ? ' has-clip' : ''}`}
              style={{ opacity: i === 0 ? 1 : 0 }}
            >
              <img className="psg-still" src={c.posterSrc} alt="" decoding="async" loading={i === 0 ? 'eager' : 'lazy'} />
              {blobs[i] && (
                <video
                  ref={(el) => { videoRefs.current[i] = el }}
                  className="psg-video"
                  src={blobs[i]}
                  muted
                  playsInline
                  preload="auto"
                  aria-hidden="true"
                  onLoadedMetadata={() => { m.current.ready[i] = true; read() }}
                  onLoadedData={(e) => { try { e.currentTarget.pause() } catch { /* noop */ } }}
                  onSeeked={() => setPainted((p) => (p[i] ? p : Object.assign([...p], { [i]: true })))}
                />
              )}
            </div>
          ))}

          {/* above the clouds */}
          <div ref={skyRef} className="psg-sky" aria-hidden="true">
            <div className="psg-cloud psg-cloud--a" />
            <div className="psg-cloud psg-cloud--b" />
            <div className="psg-cloud psg-cloud--c" />
          </div>
        </div>

        {/* colour grade + edge blur for legibility */}
        <div className="psg-grade" aria-hidden="true" />
        <ProgressiveBlur className="psg-pblur" direction="bottom" blurLayers={7} blurIntensity={0.6} />

        {/* ── aircraft window (only visible in flight) ── */}
        <div ref={windowRef} className="psg-window" aria-hidden="true">
          <span className="psg-window-glare" />
        </div>

        {/* cabin: flight card around the window */}
        <div ref={cabinRef} className="psg-cabin" style={{ opacity: 0 }} aria-hidden={phase !== 'flight'}>
          <div className="psg-cabin-top">
            <span className="psg-cabin-label">In flight · Leg 0{leg + 1}</span>
            <TextScramble as="div" className="psg-cabin-route" trigger={phase === 'flight'}>
              {`${from.code} → ${to.code}`}
            </TextScramble>
            <span className="psg-cabin-cities">{from.city} to {to.city}</span>
          </div>
          <div className="psg-cabin-bottom">
            <svg className="psg-arc" viewBox="0 0 300 70" aria-hidden="true">
              <path id="psg-arc-path" d="M10 60 Q150 -20 290 60" />
              <circle cx="10" cy="60" r="3.5" />
              <circle cx="290" cy="60" r="3.5" />
            </svg>
            <span ref={routePlaneRef} className="psg-arc-plane">✈</span>
            <div className="psg-km">
              <KmCounter mv={kmMV} />
              <span className="psg-km-unit">km from Ahmedabad</span>
            </div>
          </div>
        </div>

        {/* ── HUD ── */}
        <div className="psg-hud" aria-hidden="true">
          <div className="psg-hud-block">
            <span className="psg-hud-k">Position</span>
            <span className="psg-hud-v"><span ref={latRef}>{fmtLat(CHAPTERS[0].lat)}</span> <span ref={lonRef}>{fmtLon(CHAPTERS[0].lon)}</span></span>
          </div>
          <div className="psg-hud-block">
            <span className="psg-hud-k">Local time · {chapter.city}</span>
            <span className="psg-hud-v"><Clock tz={chapter.tz} /></span>
          </div>
          <div className="psg-hud-block psg-hud-ch">
            <span className="psg-hud-k">Chapter</span>
            <span className="psg-hud-v psg-hud-big">{chapter.chapter}<small>/0{CHAPTERS.length}</small></span>
          </div>
        </div>

        {/* ── intro title card ── */}
        <div ref={introRef} className="psg-intro">
          <div className="psg-intro-eye">// Career Narrative</div>
          <h2 className="psg-intro-title">
            <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={0.6} speedSegment={0.5} className="psg-intro-line">
              Four cities.
            </TextEffect>
            <TextEffect as="span" per="word" preset="fade-in-blur" speedReveal={0.6} speedSegment={0.5} delay={0.5} className="psg-intro-line psg-intro-accent">
              One passage.
            </TextEffect>
          </h2>
          <p className="psg-intro-sub">
            {CHAPTERS.map((c) => c.city).join('  →  ')} · {TOTAL_KM.toLocaleString('en-CA')} km
          </p>
        </div>
        <div ref={hintRef} className="psg-hint">
          <TextShimmer as="span" duration={2.2}>Scroll to board</TextShimmer>
          <i />
        </div>

        {/* ── chapter copy (lands with each city) ── */}
        <div ref={copyRef} className="psg-copy-wrap">
          <AnimatePresence mode="wait">
            {landed && (
              <motion.article
                key={chapter.id}
                className="psg-copy"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, y: -16, filter: 'blur(8px)', transition: { duration: 0.35 } }}
              >
                <TextScramble as="div" className="psg-eyebrow" duration={0.9}>
                  {`CHAPTER ${chapter.chapter} · ${chapter.code} · ${chapter.city.toUpperCase()}`}
                </TextScramble>
                <TextEffect as="h3" per="char" preset="fade-in-blur" speedReveal={1.4} className="psg-title">
                  {chapter.title}
                </TextEffect>
                <TextEffect as="p" per="word" preset="blur" speedReveal={4} delay={0.35} className="psg-desc">
                  {info.desc || ''}
                </TextEffect>
                <motion.ul
                  className="psg-chips"
                  initial="hidden"
                  animate="visible"
                  variants={{ visible: { transition: { staggerChildren: 0.06, delayChildren: 0.7 } } }}
                >
                  {chapter.metricChips.map((c) => (
                    <motion.li
                      key={c}
                      variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
                    >
                      {c}
                    </motion.li>
                  ))}
                </motion.ul>
              </motion.article>
            )}
          </AnimatePresence>
        </div>

        {/* ── passport: stamps collect as you land ── */}
        <div className="psg-passport" aria-hidden="true">
          <AnimatePresence>
            {CHAPTERS.map((c, i) => (
              (phase === 'flight' ? i <= leg : phase === 'intro' ? false : i <= active)
                ? <Stamp key={c.id} chapter={c} index={i} current={i === active} />
                : null
            ))}
          </AnimatePresence>
        </div>

        {/* ── route bar ── */}
        <nav className="psg-route" aria-label="Journey chapters">
          <div className="psg-route-track">
            <span ref={fillRef} className="psg-route-fill" />
            <span ref={planeRef} className="psg-route-plane" aria-hidden="true">✈</span>
            {CHAPTERS.map((c, i) => {
              const s = segEdges.find((x) => x.kind === 'dive' && x.i === i)
              return (
                <button
                  key={c.id}
                  type="button"
                  className={`psg-route-node${i === active ? ' is-active' : ''}${i < active ? ' is-past' : ''}`}
                  style={{ left: `${((s.start + DIVE * 0.5) / TOTAL) * 100}%`, '--ink': c.accent }}
                  onClick={() => jumpTo(i)}
                >
                  <i />
                  <span>{c.code}</span>
                </button>
              )
            })}
          </div>
        </nav>
      </div>
    </section>
  )
}
