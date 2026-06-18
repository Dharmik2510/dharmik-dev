import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  return (
    <div className={s.sectionTransition}>
      <div className={s.transitionLine} />
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
      className={s.strip}
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
          <FadeUp key={m.label} delay={i * .07}>
            <div className={s.metricCard}>
              <div className={s.metricValue}>{m.value}</div>
              <div className={s.metricLabel}>{m.label}</div>
              <p className={s.metricDetail}>{m.detail}</p>
            </div>
          </FadeUp>
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
      <div className="s-eye">Crew Manifest // Profile</div>
      <h2 className="s-title">About <em>Me</em></h2>
      <div className={s.aboutGrid}>
        <div>
          {[
            `I build intelligent systems that move from prototype to production. Currently serving as <strong>AI Developer II at Intact Financial Corporation</strong>.`,
            `I specialize in developing systems that analyze and process complex data using <strong>Apache Kafka, Databricks, Apache Spark</strong>, and deep learning frameworks — applied to real insurance-scale problems at Canada's largest P&C insurer.`,
            `Beyond Intact, I'm co-founder of <strong>CareerCurate</strong> — a platform empowering international students and immigrants to build competitive career profiles. Resume optimization, LinkedIn coaching, community, and job support.`,
          ].map((text, i) => (
            <FadeUp key={i} delay={i * .08}>
              <p className={s.aboutText}
                dangerouslySetInnerHTML={{ __html: text.replace(/<strong>/g, '<strong style="color:var(--text);font-weight:700">') }}
              />
            </FadeUp>
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

        {/* Skills */}
        <FadeUp delay={.16}>
          <div className={s.skillsWrap}>
            {CAPABILITY_GROUPS.map(group => (
              <div key={group.title} className={s.capabilityCard}>
                <div className={s.capabilityTop}>
                  <div className={s.capabilityTitle}>{group.title}</div>
                  <div className={s.capabilityLevel}>{group.level}</div>
                </div>
                <div className={s.capabilityTags}>
                  {group.items.map(sk => (
                    <span key={sk}>{sk}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </FadeUp>
      </div>
    </section>
  )
}

// ── EXPERIENCE ──
export function Experience() {
  return (
    <section className="section" id="experience">
      <div className="s-eye">Work History // Flight Log</div>
      <h2 className="s-title">Experi<em>ence</em></h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {EXPERIENCE.map((e, i) => (
          <FadeUp key={i} delay={i * .06}>
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
                  <div key={j} className={s.expBullet}>
                    <span className={s.expBulletIcon}>→</span>
                    {b}
                  </div>
                ))}
              </div>
            </SpotlightCard>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ── PROJECTS ──
export function Projects() {
  return (
    <section className="section" id="projects">
      <div className="s-eye">Cargo Manifest // Built Work</div>
      <h2 className="s-title">Projects<br /><em>&amp; Work</em></h2>
      <div className={s.projectGrid}>
        {PROJECTS.map((p, i) => (
          <FadeUp key={p.id} delay={i * .06}>
            <SpotlightCard
              className={`${s.projectCard} ${p.featured ? s.projectCardFeatured : ''}`}
              onClick={() => p.link && window.open(p.link, '_blank')}
            >
              <div className={s.projectBar} />
              <div className={s.projectMeta}>
                <span>// MISSION {p.id}</span>
                {p.featured && <span className={s.projectFeaturedLabel}>FEATURED</span>}
              </div>
              <div className={s.projectTitle}>{p.name}</div>
              <p className={s.projectDesc}>{p.desc}</p>
              <div className={s.caseGrid}>
                {[
                  ['Problem', p.problem],
                  ['Approach', p.approach],
                  ['Outcome', p.outcome],
                ].map(([label, value]) => value && (
                  <div key={label} className={s.caseItem}>
                    <span>{label}</span>
                    {value}
                  </div>
                ))}
              </div>
              <div className={s.projectStack}>
                {p.stack.map(sk => (
                  <span key={sk} className={s.projectTag}>{sk}</span>
                ))}
              </div>
              <div className={s.projectLink}>↗</div>
            </SpotlightCard>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ── ARTICLES ──
export function Articles() {
  return (
    <section className={`section ${s.articlesSection}`} id="articles">
      <div className={s.articlesHead}>
        <div>
          <div className="s-eye">Transmission Log // Medium</div>
          <h2 className="s-title">Written<br /><em>Work</em></h2>
        </div>
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
  return (
    <section className={`section ${s.contactSection}`} id="contact">
      <div className={s.contactGrid}>
        <div className={s.contactIntro}>
          <div className="s-eye">Open Channel // Contact</div>
          <div className={s.contactTitle}>
            Let's<br /><em className={s.contactAccent}>Connect</em>
          </div>
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
            <FadeUp key={c.lbl} delay={i * 0.05}>
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
            </FadeUp>
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
