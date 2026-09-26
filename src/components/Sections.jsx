import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform, useInView as useMotionInView, useReducedMotion } from 'framer-motion'
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
function SectionTransition({ icon = '◆' }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'center 0.55'] })
  const scaleX = useTransform(scrollYProgress, [0, 1], [0, 1])
  return (
    <div className={s.sectionTransition} ref={ref}>
      <motion.div className={s.transitionLine} style={{ scaleX }} />
      <motion.div
        className={s.transitionIcon}
        initial={{ scale: 0, rotate: -180 }}
        whileInView={{ scale: 1, rotate: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [.16,1,.3,1] }}
      >
        {icon}
      </motion.div>
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
  return (
    <motion.div
      className={`${s.strip} explore-strip`}
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 1.2, ease: [.16,1,.3,1] }}
    >
        {[
        { ico: '01', lbl: 'Role',      val: 'AI Developer II' },
        { ico: '02', lbl: 'Platform',  val: 'Kafka · Spark · Databricks' },
        { ico: '03', lbl: 'Impact',    val: '$500K+ operational savings' },
        { ico: '04', lbl: 'Focus',     val: 'Production AI systems' },
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
        <div className="s-eye">Control Tower // Engineering Proof</div>
        <h2 id="control-title" className={s.controlTitle}>
          Production AI with measurable outcomes.
        </h2>
        <p className={s.controlCopy}>
          The visual story matters, but the portfolio should quickly prove the level of work:
          enterprise data platforms, model governance, streaming systems, and operational impact.
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

// ── ABOUT ──
export function About() {
  return (
    <section className="section" id="about">
      <SectionHead
        eyebrow="Crew Manifest // Profile"
        title={[{ t: 'About' }, { t: 'Me', em: true }]}
        ghost="CREW MANIFEST"
      />
      <div className={s.aboutGrid}>
        <div>
          {[
            `I build intelligent systems that move from prototype to production. Currently serving as <strong>AI Developer II at Intact Financial Corporation</strong>.`,
            `I specialize in developing systems that analyze and process complex data using <strong>Apache Kafka, Databricks, Apache Spark</strong>, and deep learning frameworks — applied to real insurance-scale problems at Canada's largest P&C insurer.`,
            `Beyond Intact, I'm co-founder of <strong>CareerCurate</strong> — a platform empowering international students and immigrants to build competitive career profiles. Resume optimization, LinkedIn coaching, community, and job support.`,
          ].map((text, i) => (
            <ScrollWords key={i} html={text} className={s.aboutText} />
          ))}

          {/* CareerCurate Banner */}
          <FadeUp delay={.28}>
            <div className={s.ccBanner}>
              <div className={s.ccIcon}>🚀</div>
              <div>
                <div className={s.ccTitle}>
                  CareerCurate
                  <span className={s.ccBadge}>CO-FOUNDER</span>
                </div>
                <div className={s.ccDesc}>
                  Empowering international students to build successful career profiles.{' '}
                  <a href={PERSONAL.linkedin} target="_blank" rel="noreferrer" className={s.ccLink}>
                    Connect on LinkedIn ↗
                  </a>
                </div>
              </div>
            </div>
          </FadeUp>


          {/* Education */}
          <FadeUp delay={.36}>
            <div style={{ marginTop: 32 }}>
              <div className={s.sectionLabel}>// Education</div>
              {EDUCATION.map(e => (
                <div key={e.degree} className={s.eduCard}>
                  <div className={s.eduDegree}>{e.degree}</div>
                  <div>
                    <div className={s.eduTitle}>{e.title}</div>
                    <div className={s.eduMeta}>// {e.institution} · {e.location}</div>
                  </div>
                </div>
              ))}
            </div>
          </FadeUp>

          {/* Certs */}
          <FadeUp delay={.44}>
            <div style={{ marginTop: 24 }}>
              <div className={s.sectionLabel}>// Certifications</div>
              <div className={s.certGrid}>
                {CERTIFICATIONS.map(c => (
                  <div key={c.name} className={s.certCard}>
                    <div className={s.certIcon}>{c.icon}</div>
                    <div>
                      <div className={s.certName}>{c.name}</div>
                      <div className={s.certOrg}>{c.org}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FadeUp>
        </div>

        {/* Skills — stay pinned while the story on the left is read */}
        <div className="cn-about-sticky">
          <div className={s.skillsWrap} style={{ perspective: 1200 }}>
            {CAPABILITY_GROUPS.map((group, gi) => (
              <motion.div key={group.title} className={`${s.capabilityCard} cn-cap`} {...revealSide(gi, 90)}>
                <div className={s.capabilityTop}>
                  <div className={s.capabilityTitle}>{group.title}</div>
                  <div className={s.capabilityLevel}>{group.level}</div>
                </div>
                <motion.div
                  className={s.capabilityTags}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true, margin: '0px 0px -10% 0px' }}
                  variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.35 + gi * 0.07 } } }}
                >
                  {group.items.map(sk => (
                    <motion.span
                      key={sk}
                      variants={{ hidden: { opacity: 0, y: 12, scale: .9 }, show: { opacity: 1, y: 0, scale: 1 } }}
                    >
                      {sk}
                    </motion.span>
                  ))}
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
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
              {e.badge === 'current' ? 'CURRENT' : 'PAST'}
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

const CITY_CODE = (meta = '') =>
  /ahmedabad/i.test(meta) ? 'AMD' : /montr/i.test(meta) ? 'YUL' : /halifax/i.test(meta) ? 'YHZ' : 'YYZ'

// Desktop: the section pins and vertical scroll flies a horizontal route of boarding-pass cards,
// oldest → newest (Ahmedabad → Toronto). Phones: vertical flight log.
function FlightPath() {
  const legs = [...EXPERIENCE].reverse()
  const pinRef = useRef(null)
  const trackRef = useRef(null)
  const [dist, setDist] = useState(0)
  const [active, setActive] = useState(0)
  const { scrollYProgress } = useScroll({ target: pinRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0.04, 0.96], [0, -dist])
  const planeLeft = useTransform(scrollYProgress, [0.04, 0.96], ['0%', '100%'])
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
        <div className="fp-route" aria-hidden="true">
          <div className="fp-route-line"><motion.span style={{ scaleX: fill }} /></div>
          <motion.span className="fp-route-plane" style={{ left: planeLeft }}>✈</motion.span>
          {legs.map((e, i) => (
            <span
              key={i}
              className={`fp-route-stop${i <= active ? ' is-past' : ''}${i === active ? ' is-active' : ''}`}
              style={{ left: `${(i / (legs.length - 1)) * 100}%` }}
            >
              <i />
              <b>{CITY_CODE(e.meta)}</b>
            </span>
          ))}
        </div>

        <motion.div className="fp-track" ref={trackRef} style={{ x }}>
          {legs.map((e, i) => (
            <article key={i} className={`fp-card${i === active ? ' is-active' : ''}`}>
              <div className="fp-card-stub">
                <span className="fp-leg">LEG {String(i + 1).padStart(2, '0')}</span>
                <span className="fp-code">{CITY_CODE(e.meta)}</span>
                <span className="fp-city">{e.meta}</span>
                <span className={`fp-badge ${e.badge === 'current' ? 'is-current' : ''}`}>
                  {e.badge === 'current' ? 'IN FLIGHT' : 'LANDED'}
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

        <div className="fp-hint" aria-hidden="true">
          <span>{String(active + 1).padStart(2, '0')}</span> / {String(legs.length).padStart(2, '0')} · scroll to fly
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
        {!reduce && <motion.span className="cn-rail-plane" style={{ top: planeTop }}>✈</motion.span>}
      </div>
      {EXPERIENCE.map((e, i) => (
        <FlightLeg key={i} e={e} i={i} total={EXPERIENCE.length} />
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
        eyebrow="Work History // Flight Log"
        title={[{ t: 'Experi', glue: true }, { t: 'ence', em: true }]}
        ghost="FLIGHT LOG"
      />
      {wide && !reduce ? <FlightPath /> : <FlightLogVertical />}
    </section>
  )
}

// ── PROJECTS — split-screen case files: pinned index on the left, case study scrolls on the right ──
function CaseFile({ p, i, onActive }) {
  const ref = useRef(null)
  const inView = useMotionInView(ref, { margin: '-45% 0px -45% 0px' })
  useEffect(() => { if (inView) onActive(i) }, [inView, i, onActive])
  const steps = [['Problem', p.problem], ['Approach', p.approach], ['Outcome', p.outcome]].filter(([, v]) => v)
  return (
    <article ref={ref} className="pj-case" id={`project-${p.id}`}>
      <div className="pj-case-meta">
        <span>// CASE FILE {p.id}</span>
        {p.featured && <span className="pj-featured">FEATURED</span>}
      </div>
      <motion.h3 className="pj-case-title" {...revealUp(0)}>{p.name}</motion.h3>
      <motion.p className="pj-case-desc" {...revealUp(1)}>{p.desc}</motion.p>
      <div className="pj-steps">
        {steps.map(([label, value], k) => (
          <motion.div key={label} className="pj-step" {...revealSide(k, 60)}>
            <span className="pj-step-n">0{k + 1}</span>
            <span className="pj-step-label">{label}</span>
            <p>{value}</p>
          </motion.div>
        ))}
      </div>
      <div className="pj-case-foot">
        <div className="pj-stack">
          {p.stack.map((sk) => <span key={sk}>{sk}</span>)}
        </div>
        {p.link && (
          <a className="pj-link" href={p.link} target="_blank" rel="noreferrer">View on GitHub ↗</a>
        )}
      </div>
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
        eyebrow="Cargo Manifest // Built Work"
        title={[{ t: 'Projects', br: true }, { t: '& Work', em: true }]}
        ghost="CARGO"
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
          eyebrow="Transmission Log // Medium"
          title={[{ t: 'Written', br: true }, { t: 'Work', em: true }]}
          ghost="TRANSMISSIONS"
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
          <div className="s-eye">Open Channel // Contact</div>
          <motion.div
            className={`${s.contactTitle} cn-contact-title`}
            style={{ scale: titleScale, letterSpacing: titleSpacing, opacity: titleOpacity }}
          >
            Let's<br /><em className={s.contactAccent}>Connect</em>
          </motion.div>
          <p className={s.contactDesc}>
            Available for applied AI, data platform, and production ML conversations.
            Focused on systems where reliability, governance, and measurable impact matter.
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
        © 2026 // AI DEVELOPER II // INTACT FINANCIAL
      </div>
      <div className={s.footerRight}>
        <span>Production AI · Data Platforms · Model Governance</span>
      </div>
    </footer>
  )
}

// ── SECTION TRANSITION (exported) ──
export { SectionTransition }
