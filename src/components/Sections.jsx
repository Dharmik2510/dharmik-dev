import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView as useMotionInView, useReducedMotion, useMotionValueEvent } from 'framer-motion'
import {
  SectionHead, ScrollWords, CountUp, revealUp, revealSide, useIsWide,
} from './cinema'
import { SlidingNumber, TextEffect } from './motion-primitives'
import { useInView } from 'react-intersection-observer'
import {
  STORY_CHAPTERS, IMPACT_METRICS, CAPABILITY_GROUPS, CERTIFICATIONS, EDUCATION,
  EXPERIENCE, PROJECTS, ARTICLES, TICKER_ITEMS, PERSONAL
} from '../data'
import Globe from './Globe'
import { useTimeSince } from '../hooks'
import { CHAPTERS } from '../data/journey'
import { PLACES } from '../data/about'
import ArticlesFeed from './ArticlesFeed'
import s from './Sections.module.css'

// ── FADE WRAPPER ──
function FadeUp({ children, delay = 0, className = '' }) {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  return (
    <motion.div
      ref={ref} className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: [.16,1,.3,1] }}
    >
      {children}
    </motion.div>
  )
}

// ── WAYPOINT OBSERVER WRAPPER ──
function WaypointWrapper({ children, onInView }) {
  const { ref, inView } = useInView({ threshold: 0.5 })
  useEffect(() => {
    if (inView) onInView()
  }, [inView, onInView])
  return <div ref={ref}>{children}</div>
}

// ── SECTION TRANSITION ──
function SectionTransition() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.55'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <div className={s.sectionTransition} ref={ref} aria-hidden="true">
      <motion.div className={s.transitionLine} style={{ scaleX }} />
    </div>
  )
}

// ── SPOTLIGHT CARD WRAPPER ──
function SpotlightCard({ children, className = '', ...props }) {
  const ref = useRef(null)
  
  const onMove = (e) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Gradient Spotlight
    ref.current.style.setProperty('--mx', `${x}px`)
    ref.current.style.setProperty('--my', `${y}px`)
    
    // 3D Holographic Tilt
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = ((y - centerY) / centerY) * -6 // Max rotation degrees
    const rotateY = ((x - centerX) / centerX) * 6
    
    ref.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    ref.current.style.transition = 'transform 0.1s ease-out'
  }
  
  const onLeave = () => {
    if (!ref.current) return
    ref.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)'
    ref.current.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)'
  }

  return (
    <div 
      ref={ref} 
      className={`${s.spotlightCard} ${className}`} 
      onMouseMove={onMove} 
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </div>
  )
}

// ── EXPLORE STRIP ──
export function ExploreStrip() {
  const inCanada = useTimeSince('2021-09-07')
  return (
    <motion.div
      className={`${s.strip} explore-strip`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 1.2, ease: [.16,1,.3,1] }}
    >
        {[
        { ico: '01', lbl: 'Landed',    val: '07 Sep 2021 · Halifax' },
        { ico: '02', lbl: 'In Canada', val: inCanada || '—' },
        { ico: '03', lbl: 'Route',     val: 'YHZ → YUL → YYZ' },
        { ico: '04', lbl: 'Writing',   val: `${ARTICLES.length} articles on Medium` },
      ].map((f, i) => (
        <React.Fragment key={f.lbl}>
          {i > 0 && <div className={s.stripDiv} />}
          <div className={s.stripItem}>
            <div className={s.stripIco}>{f.ico}</div>
            <div className={s.stripLbl}>{f.lbl}</div>
            <div className={s.stripVal}>{f.val}</div>
          </div>
        </React.Fragment>
      ))}
    </motion.div>
  )
}

// ── TICKER ──
export function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="ticker-bar">
      <div className="ticker-inner">
        {items.map(([k, v], i) => (
          <div key={i} className="ti"><span>{k}</span>  <b>{v}</b>  ·</div>
        ))}
      </div>
    </div>
  )
}

// ── CONTROL TOWER ──
export function ControlTower() {
  return (
    <section className={s.controlTower} id="impact" aria-labelledby="control-title">
      <div className={s.controlIntro}>
        <p className="cn-kicker">Impact</p>
        <h2 id="control-title" className={s.controlTitle}>
          What the work adds up to.
        </h2>
        <p className={s.controlCopy}>
          Numbers from my time at Intact Financial, Canada's largest P&amp;C insurer.
        </p>
      </div>
      <div className={s.metricGrid}>
        {IMPACT_METRICS.map((m, i) => (
          <motion.div key={m.label} {...revealUp(i)} style={{ transformPerspective: 900 }}>
            <div className={s.metricCard}>
              <div className={s.metricValue}><CountUp value={m.value} /></div>
              <div className={s.metricLabel}>{m.label}</div>
              <p className={s.metricDetail}>{m.detail}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── JOURNEY ──
export function Journey() {
  const [activeCity, setActiveCity] = useState('AMD')
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  })
  const planeX = useTransform(scrollYProgress, [0, 1], ['18px', 'calc(100% - 18px)'])

  return (
    <section id="journey" className={s.storyJourney} ref={ref}>
      <div className={s.storySticky}>
        <div className={s.storyPanel}>
          <div className="s-eye">Career Narrative</div>
          <h2 className={s.storyTitle}>Four chapters. One operating system.</h2>
          <div className={s.routeRail} aria-hidden="true">
            <div className={s.routeLine} />
            <motion.div className={s.routePlane} style={{ left: planeX }}>✈</motion.div>
            {STORY_CHAPTERS.map((chapter, i) => (
              <div
                key={chapter.code}
                className={`${s.routeStop} ${activeCity === chapter.code ? s.routeStopActive : ''}`}
                style={{
                  left: i === 0
                    ? '18px'
                    : i === STORY_CHAPTERS.length - 1
                      ? 'calc(100% - 18px)'
                      : `${(i / (STORY_CHAPTERS.length - 1)) * 100}%`,
                }}
              >
                <span>{chapter.code}</span>
              </div>
            ))}
          </div>
          <div className={s.storyGlobe}>
            <Globe activeCity={activeCity} />
          </div>
        </div>
      </div>

      <div className={s.storyChapters}>
        {STORY_CHAPTERS.map((chapter, i) => (
          <WaypointWrapper key={chapter.code} onInView={() => setActiveCity(chapter.code)}>
            <motion.article
              className={s.chapterCard}
              initial={{ opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-20% 0px -20% 0px' }}
              transition={{ duration: .7, ease: [.16,1,.3,1] }}
            >
              <div className={s.chapterIndex}>0{i + 1}</div>
              <div className={s.chapterCode}>{chapter.code}</div>
              <div className={s.chapterKicker}>{chapter.kicker}</div>
              <h3>{chapter.title}</h3>
              <p>{chapter.outcome}</p>
              <div className={s.chapterProof}>
                {chapter.proof.map(item => (
                  <div key={item} className={s.chapterProofItem}>
                    <span />
                    {item}
                  </div>
                ))}
              </div>
            </motion.article>
          </WaypointWrapper>
        ))}
      </div>
    </section>
  )
}

// ── ABOUT — "What I carried": one place per city (university / office), with that chapter's document ──
function PlaceMedia({ c, place, progress, reduce }) {
  const photos = place.photos?.length ? place.photos : [c.posterSrc]
  const videoRef = useRef(null)
  const [blob, setBlob] = useState(null)
  // Ken Burns drift tied to scroll
  const scale = useTransform(progress, [0, 1], reduce ? [1, 1] : [1.14, 1.02])
  const x = useTransform(progress, [0, 1], reduce ? ['0%', '0%'] : ['-3%', '3%'])
  // several photos cross-fade as you scroll through the row
  const n = photos.length
  // scroll-played clip (same technique as the Journey film)
  useEffect(() => {
    if (!place.video || reduce) return
    let url
    fetch(place.video).then((r) => r.blob()).then((b) => { url = URL.createObjectURL(b); setBlob(url) }).catch(() => {})
    return () => url && URL.revokeObjectURL(url)
  }, [place.video, reduce])
  useMotionValueEvent(progress, 'change', (v) => {
    const el = videoRef.current
    if (el && el.duration && !el.seeking) el.currentTime = Math.min(0.999, Math.max(0, v)) * el.duration
  })
  return (
    <motion.div className="ab-media" style={{ scale, x }}>
      {photos.map((src, k) => (
        <PhotoLayer key={src} src={src} k={k} n={n} progress={progress} />
      ))}
      {blob && <video ref={videoRef} className="ab-video" src={blob} muted playsInline preload="auto" aria-hidden="true" />}
    </motion.div>
  )
}

function PhotoLayer({ src, k, n, progress }) {
  // photos swap while the row sits mid-screen; short fades avoid muddy double exposures
  const local = useTransform(progress, [0.3, 0.7], [0, 1])
  const edge = k / n
  const opacity = useTransform(local, (v) => {
    if (k === 0) return 1
    return Math.min(1, Math.max(0, (v - edge) / 0.06 + 0.5))
  })
  return <motion.img src={src} alt="" loading="lazy" style={{ opacity }} />
}

function PlaceDoc({ doc, c, accent }) {
  return (
    <motion.div
      className="ab-doc"
      style={{ '--city': accent }}
      initial={{ opacity: 0, y: 50, rotate: 8 }}
      whileInView={{ opacity: 1, y: 0, rotate: -4 }}
      viewport={{ once: true, margin: '0px 0px -20% 0px' }}
      transition={{ type: 'spring', stiffness: 160, damping: 20, delay: 0.25 }}
      aria-hidden="true"
    >
      <div className="ab-doc-head">
        <span>{doc.kind}</span>
        <span className="ab-doc-code">{c.code}</span>
      </div>
      <div className="ab-doc-body">
        <div className="ab-doc-photo">DS</div>
        <div>
          <b>Dharmik Soni</b>
          <span>{doc.org}</span>
          <span>{doc.line}</span>
          <span className="ab-doc-city">{doc.city}</span>
        </div>
      </div>
      <div className="ab-doc-strip" />
    </motion.div>
  )
}

function CityRow({ c, i }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const place = PLACES[c.code] || {}
  const { scrollYProgress: reveal } = useScroll({ target: ref, offset: ['start 0.95', 'start 0.35'] })
  const clip = useTransform(reveal, [0, 1], reduce ? ['inset(0% 0% 0% 0%)', 'inset(0% 0% 0% 0%)'] : ['inset(0% 100% 0% 0%)', 'inset(0% 0% 0% 0%)'])
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  return (
    <div ref={ref} className="ab-row" style={{ '--city': c.accent }}>
      <div className="ab-stage">
        <motion.div className="ab-frame" style={{ clipPath: clip }}>
          <PlaceMedia c={c} place={place} progress={pass} reduce={reduce} />
          <span className="ab-frame-place">{place.photos?.length || place.video ? place.place : `${c.city}, from the film`}</span>
        </motion.div>
        {place.doc && <PlaceDoc doc={place.doc} c={c} accent={c.accent} />}
      </div>
      <motion.div className="ab-text" {...revealUp(1)}>
        <span className="ab-num">0{i + 1} · {c.city}</span>
        <p className="ab-where">{place.where}</p>
        <p className="ab-first">{place.first}</p>
        <ul className="ab-tags">
          {c.metricChips.map((t) => <li key={t}>{t}</li>)}
        </ul>
      </motion.div>
    </div>
  )
}

export function About() {
  return (
    <section className="section" id="about">
      <SectionHead
        eyebrow="About"
        title={[{ t: 'What I' }, { t: 'carried', em: true }]}
      />

      <div className="ab-intro">
        {[
          `I studied and started working in <strong>Ahmedabad</strong>, building online stores and back-end systems for local businesses.`,
          `In September 2021 I moved to <strong>Halifax</strong> for a Master's at Dalhousie, then to <strong>Montréal</strong> for my first production ML role at Intact.`,
          `Today I'm in <strong>Toronto</strong>, building the data platforms behind Intact's usage-based insurance. On the side I co-founded <strong>CareerCurate</strong>, which helps newcomers and international students start their careers in Canada.`,
        ].map((text, i) => (
          <ScrollWords key={i} html={text} className="ab-intro-p" />
        ))}
      </div>

      <div className="ab-rows">
        {CHAPTERS.map((c, i) => <CityRow key={c.id} c={c} i={i} />)}
      </div>

      <div className="ab-extra">
        <motion.div {...revealUp(0)}>
          <p className="ab-label">Toolkit</p>
          <dl className="ab-kit">
            {CAPABILITY_GROUPS.map((g) => (
              <div key={g.title}>
                <dt>{g.title}</dt>
                <dd>{g.items.join(' · ')}</dd>
              </div>
            ))}
          </dl>
        </motion.div>

        <motion.div {...revealUp(1)}>
          <p className="ab-label">Education</p>
          <ul className="ab-list">
            {EDUCATION.map((e) => (
              <li key={e.degree}><b>{e.title}</b><span>{e.degree} · {e.institution}, {e.location}</span></li>
            ))}
          </ul>
          <p className="ab-label">Certifications</p>
          <ul className="ab-list">
            {CERTIFICATIONS.map((c) => (
              <li key={c.name}><b>{c.name}</b><span>{c.org}</span></li>
            ))}
          </ul>
          <p className="ab-label">On the side</p>
          <p className="ab-side">
            Co-founder of <b>CareerCurate</b>: résumés, LinkedIn, referrals and a community for people starting over in Canada.{' '}
            <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer">Say hi on LinkedIn ↗</a>
          </p>
        </motion.div>
      </div>
    </section>
  )
}

// ── EXPERIENCE — "Flight Log": a route line draws itself as you scroll ──
function FlightLeg({ e, i, total }) {
  const ref = useRef(null)
  const lit = useMotionInView(ref, { margin: '-45% 0px -45% 0px' })
  const [seen, setSeen] = useState(false)
  useEffect(() => { if (lit) setSeen(true) }, [lit])
  return (
    <div ref={ref} className={`cn-leg${seen ? ' is-lit' : ''}`}>
      <span className="cn-leg-node" aria-hidden="true" />
      <span className="cn-leg-tag" aria-hidden="true">LEG {String(total - i).padStart(2, '0')}</span>
      <motion.div {...revealSide(0, 90)}>
        <SpotlightCard className={s.expCard}>
          <div className={s.expBar} />
          <div className={s.expHeader}>
            <div className={s.expRole}>{e.role}</div>
            <div className={`${s.expBadge} ${e.badge === 'current' ? s.expBadgeCurrent : s.expBadgePast}`}>
              {e.badge === 'current' ? 'Now' : 'Earlier'}
            </div>
          </div>
          <div className={s.expCompany}>{e.company}</div>
          <div className={s.expMeta}>{e.meta}</div>
          <div className={s.expBullets}>
            {e.bullets.map((b, j) => (
              <motion.div
                key={j}
                className={s.expBullet}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '0px 0px -8% 0px' }}
                transition={{ duration: .6, delay: .25 + j * .07, ease: [.16, 1, .3, 1] }}
              >
                <span className={s.expBulletIcon}>→</span>
                {b}
              </motion.div>
            ))}
          </div>
        </SpotlightCard>
      </motion.div>
    </div>
  )
}

const CITY = Object.fromEntries(CHAPTERS.map((c) => [c.code, c]))
// Career order, oldest → newest; the side venture (CareerCurate) goes last
const isSide = (e) => /co-?founder/i.test(e.role)
const CHRONO = [...EXPERIENCE.filter((e) => !isSide(e)).reverse(), ...EXPERIENCE.filter(isSide)]
const NEWEST = [...EXPERIENCE.filter((e) => !isSide(e)), ...EXPERIENCE.filter(isSide)]
const CITY_CODE = (meta = '') =>
  /ahmedabad/i.test(meta) ? 'AMD' : /montr/i.test(meta) ? 'YUL' : /halifax/i.test(meta) ? 'YHZ' : 'YYZ'

// Desktop: the section pins and vertical scroll flies a horizontal route of boarding-pass cards,
// oldest → newest (Ahmedabad → Toronto). Phones: vertical flight log.
function FlightPath() {
  const legs = CHRONO
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist])
  const fill = useTransform(scrollYProgress, [0.04, 0.96], [0, 1])

  useEffect(() => {
    const measure = () => {
      const t = trackRef.current
      if (t) setDist(Math.max(0, t.scrollWidth - window.innerWidth + 96))
    }
    measure()
    window.addEventListener('resize', measure)
    return () => window.removeEventListener('resize', measure)
  }, [])
  useEffect(() => scrollYProgress.on('change', (v) => {
    const i = Math.min(legs.length - 1, Math.max(0, Math.round(((v - 0.04) / 0.92) * (legs.length - 1))))
    setActive((a) => (a === i ? a : i))
  }), [scrollYProgress, legs.length])

  return (
    <div className="fp-pin" ref={pinRef} style={{ height: `${legs.length * 55 + 60}vh` }}>
      <div className="fp-sticky">
        <motion.div className="fp-track" ref={trackRef} style={{ x }}>
          {legs.map((e, i) => (
            <article
              key={i}
              className={`fp-card${i === active ? ' is-active' : ''}`}
              style={{ '--city': CITY[CITY_CODE(e.meta)]?.accent }}
            >
              <div className="fp-card-stub">
                <span className="fp-leg">{isSide(e) ? 'On the side' : String(i + 1).padStart(2, '0')}</span>
                <span className="fp-code">{CITY_CODE(e.meta)}</span>
                <span className="fp-city">{e.meta}</span>
                <span className={`fp-badge ${e.badge === 'current' ? 'is-current' : ''}`}>
                  {e.badge === 'current' ? 'Now' : 'Earlier'}
                </span>
              </div>
              <div className="fp-card-body">
                <div className="fp-company">{e.company}</div>
                <h3 className="fp-role">{e.role}</h3>
                <ul className="fp-bullets">
                  {e.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </motion.div>

        <div className="fp-progress" aria-hidden="true">
          <span className="fp-progress-n">{String(active + 1).padStart(2, '0')}</span>
          <span className="fp-progress-line"><motion.i style={{ scaleX: fill }} /></span>
          <span className="fp-progress-n is-muted">{String(legs.length).padStart(2, '0')}</span>
        </div>
      </div>
    </div>
  )
}

function FlightLogVertical() {
  const logRef = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: logRef, offset: ['start 0.65', 'end 0.6'] })
  const fill = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0, 1])
  const planeTop = useTransform(scrollYProgress, [0, 1], ['0%', '100%'])
  return (
    <div className="cn-log" ref={logRef}>
      <div className="cn-rail" aria-hidden="true">
        <motion.div className="cn-rail-fill" style={{ scaleY: fill }} />
      </div>
      {NEWEST.map((e, i) => (
        <FlightLeg key={i} e={e} i={i} total={NEWEST.length} />
      ))}
    </div>
  )
}

export function Experience() {
  const wide = useIsWide()
  const reduce = useReducedMotion()
  return (
    <section className="section" id="experience">
      <SectionHead
        eyebrow="Experience"
        title={[{ t: 'Six roles.', br: true }, { t: 'Two countries.', em: true }]}
      />
      {wide && !reduce ? <FlightPath /> : <FlightLogVertical />}
    </section>
  )
}

// ── PROJECTS — split-screen case files: pinned index on the left, case study scrolls on the right ──
function CaseFile({ p, i, onActive }) {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const inView = useMotionInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => { if (inView) onActive(i) }, [inView, i, onActive])
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const titleX = useTransform(scrollYProgress, [0, 1], reduce ? ['0%', '0%'] : ['6%', '-10%'])
  return (
    <article ref={ref} className="pj-case" id={`project-${p.id}`}>
      <div className="pj-poster" aria-hidden="true">
        <motion.span style={{ x: titleX }}>{p.name}</motion.span>
      </div>
      <motion.h3 className="pj-case-title" {...revealUp(0)}>{p.name}</motion.h3>
      <motion.p className="pj-case-desc" {...revealUp(1)}>{p.desc}</motion.p>

      {p.problem && (
        <motion.blockquote className="pj-quote" {...revealUp(2)}>
          {p.problem}
        </motion.blockquote>
      )}
      <div className="pj-two">
        {p.approach && (
          <motion.div {...revealSide(0, 50)}>
            <span className="pj-label">What I built</span>
            <p>{p.approach}</p>
          </motion.div>
        )}
        {p.outcome && (
          <motion.div {...revealSide(1, 50)}>
            <span className="pj-label">What it does</span>
            <p>{p.outcome}</p>
          </motion.div>
        )}
      </div>

      <motion.div className="pj-credits" {...revealUp(0)}>
        <span className="pj-label">Built with</span>
        <p>{p.stack.join('  ·  ')}</p>
        {p.link && (
          <a className="pj-link" href={p.link} target="_blank" rel="noreferrer">Code on GitHub ↗</a>
        )}
      </motion.div>
    </article>
  )
}

export function Projects() {
  const [active, setActive] = useState(0)
  const onActive = React.useCallback((i) => setActive(i), [])
  const p = PROJECTS[active]
  const go = (i) => {
    const el = document.getElementById(`project-${PROJECTS[i].id}`)
    if (!el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 110
    if (window.__lenis) window.__lenis.scrollTo(y, { duration: 1.2 })
    else window.scrollTo({ top: y, behavior: 'smooth' })
  }
  return (
    <section className="section" id="projects">
      <SectionHead
        eyebrow="Projects"
        title={[{ t: "Things I've" }, { t: 'built', em: true }]}
      />
      <div className="pj">
        <aside className="pj-aside">
          <div className="pj-counter">
            <SlidingNumber value={active + 1} padStart={2} />
            <small>/{String(PROJECTS.length).padStart(2, '0')}</small>
          </div>
          <TextEffect key={p.id} as="div" per="char" preset="fade-in-blur" speedReveal={2} className="pj-aside-title">
            {p.name}
          </TextEffect>
          <ol className="pj-index">
            {PROJECTS.map((q, i) => (
              <li key={q.id}>
                <button type="button" className={i === active ? 'is-active' : ''} onClick={() => go(i)}>
                  <span>{q.id}</span>{q.name}
                </button>
              </li>
            ))}
          </ol>
          <div className="pj-progress"><span style={{ transform: `scaleX(${(active + 1) / PROJECTS.length})` }} /></div>
        </aside>
        <div className="pj-main">
          {PROJECTS.map((q, i) => <CaseFile key={q.id} p={q} i={i} onActive={onActive} />)}
        </div>
      </div>
    </section>
  )
}

// ── ARTICLES ──
export function Articles() {
  return (
    <section className={`section ${s.articlesSection}`} id="articles">
      <div className={s.articlesHead}>
        <SectionHead
          eyebrow="Writing"
          title={[{ t: 'Notes from', br: true }, { t: 'the work', em: true }]}
        />
        <a
          href={PERSONAL.medium}
          target="_blank"
          rel="noreferrer"
          className={s.mediumProfile}
        >
          <span className={s.mediumProfileIcon}>M</span>
          <span>
            <span className={s.mediumProfileLabel}>Follow on Medium</span>
            <span className={s.mediumProfileHandle}>@dhsoni2510</span>
          </span>
          <span className={s.mediumProfileArrow}>↗</span>
        </a>
      </div>
      <ArticlesFeed articles={ARTICLES} />
    </section>
  )
}

// ── CONTACT ──
const CONTACT_CHANNELS = [
  {
    lbl: 'Email',
    val: PERSONAL.email,
    href: `mailto:${PERSONAL.email}`,
    accent: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    lbl: 'Phone',
    val: PERSONAL.phone,
    href: `tel:${PERSONAL.phone}`,
    accent: 'green',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    lbl: 'LinkedIn',
    val: 'dharmik-soni',
    href: PERSONAL.linkedin,
    accent: 'cyan',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.59 0 4.25 2.36 4.25 5.43v6.31zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z" />
      </svg>
    ),
  },
  {
    lbl: 'GitHub',
    val: 'Dharmik2510',
    href: PERSONAL.github,
    accent: 'green',
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.92.58.1.79-.25.79-.56v-2c-3.2.7-3.87-1.36-3.87-1.36-.52-1.34-1.28-1.7-1.28-1.7-1.05-.72.08-.7.08-.7 1.16.08 1.78 1.2 1.78 1.2 1.03 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18.91-.25 1.89-.38 2.86-.39.97 0 1.95.13 2.86.39 2.19-1.49 3.15-1.18 3.15-1.18.62 1.59.23 2.76.11 3.05.73.81 1.18 1.84 1.18 3.1 0 4.42-2.69 5.4-5.25 5.68.41.36.78 1.06.78 2.13v3.16c0 .31.21.66.79.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z" />
      </svg>
    ),
  },
  {
    lbl: 'Medium',
    val: '@dhsoni2510',
    href: PERSONAL.medium,
    accent: 'amber',
    wide: true,
    icon: (
      <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" aria-hidden="true">
        <path d="M4.37 7.3c.03-.3-.08-.59-.3-.79L1.85 4.04v-.04h6.83l5.28 11.58L18.6 4h6.51v.04l-1.9 1.85c-.16.13-.24.33-.21.53v13.16c-.03.2.05.4.21.53l1.86 1.85v.04h-9.32v-.04l1.92-1.89c.19-.19.19-.25.19-.54V8.61L13.5 22h-.72L7.65 9.39v8.85c-.06.39.07.79.36 1.05l2.5 3.03v.04H3.36v-.04l2.5-3.03c.29-.27.41-.66.34-1.05V7.3z" />
      </svg>
    ),
  },
]

const CONTACT_TOPICS = [
  'Production AI',
  'Data Platforms',
  'Spark & Databricks',
  'ML Governance',
  'Agent Systems',
]

export function Contact() {
  const ref = useRef(null)
  const reduce = useReducedMotion()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'start 0.25'] })
  const titleScale = useTransform(scrollYProgress, [0, 1], reduce ? [1, 1] : [0.72, 1])
  const titleSpacing = useTransform(scrollYProgress, [0, 1], reduce ? ['0.02em', '0.02em'] : ['0.32em', '0.02em'])
  const titleOpacity = useTransform(scrollYProgress, [0, 0.6], [0.15, 1])
  return (
    <section className={`section ${s.contactSection}`} id="contact" ref={ref}>
      <div className={s.contactGrid}>
        <div className={s.contactIntro}>
          <p className="cn-kicker">Next stop</p>
          <motion.div
            className={`${s.contactTitle} cn-contact-title`}
            style={{ scale: titleScale, letterSpacing: titleSpacing, opacity: titleOpacity }}
          >
            Let's<br /><em className={s.contactAccent}>Connect</em>
          </motion.div>
          <p className={s.contactDesc}>
            If you're working on data platforms, streaming or production ML, I'd like to hear about it.
            The fastest way to reach me is email.
          </p>

          <div className={s.contactStatus}>
            <span className={s.contactStatusDot} aria-hidden="true" />
            <span>Open to conversations</span>
            <span className={s.contactStatusSep}>·</span>
            <span>{PERSONAL.location}</span>
          </div>

          <div className={s.contactTopics}>
            {CONTACT_TOPICS.map((topic) => (
              <span key={topic} className={s.contactTopic}>{topic}</span>
            ))}
          </div>

          <a href={`mailto:${PERSONAL.email}`} className={s.contactCta}>
            <span>Send an email</span>
            <span className={s.contactCtaArrow}>→</span>
          </a>
        </div>

        <div className={s.contactChannels}>
          {CONTACT_CHANNELS.map((c, i) => (
            <motion.div key={c.lbl} {...revealUp(i)} style={{ transformPerspective: 900 }} className={c.wide ? s.contactCardWide : ''}>
              <a
                href={c.href}
                target={c.href.startsWith('http') ? '_blank' : undefined}
                rel="noreferrer"
                className={`${s.contactCard} ${s[`contactCard${c.accent.charAt(0).toUpperCase() + c.accent.slice(1)}`]} ${c.wide ? s.contactCardWide : ''}`}
                aria-label={`${c.lbl}: ${c.val}`}
              >
                <div className={s.contactCardIcon}>{c.icon}</div>
                <div className={s.contactCardBody}>
                  <div className={s.contactCardLabel}>{c.lbl}</div>
                  <div className={s.contactCardVal}>{c.val}</div>
                </div>
                <div className={s.contactCardArrow}>↗</div>
              </a>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FOOTER ──
export function Footer() {
  return (
    <footer className={s.footer}>
      <div className={s.footerLeft}>
        © 2026 Dharmik Soni · Toronto
      </div>
      <div className={s.footerRight}>
        <span>Production AI · Data Platforms · Model Governance</span>
      </div>
    </footer>
  )
}

// ── SECTION TRANSITION (exported) ──
export { SectionTransition }
