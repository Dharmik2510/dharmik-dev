import React, { useState, useEffect, useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  STORY_CHAPTERS, IMPACT_METRICS, CAPABILITY_GROUPS, CERTIFICATIONS, EDUCATION,
  EXPERIENCE, PROJECTS, ARTICLES, TICKER_ITEMS, PERSONAL
} from '../data'
import Globe from './Globe'
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
  const readingTimes = ['6 min read', '8 min read', '5 min read', '7 min read']
  return (
    <section className="section" id="articles">
      <div className="s-eye">Transmission Log // Medium</div>
      <h2 className="s-title">Written<br /><em>Work</em></h2>
      <p className={s.mediumMeta}>
        All articles at{' '}
        <a href={PERSONAL.medium} target="_blank" rel="noreferrer" className={s.mediumLink}>
          medium.com/@dhsoni2510 ↗
        </a>
      </p>
      <div className={s.articleGrid}>
        {ARTICLES.map((a, i) => (
          <FadeUp key={i} delay={i * .08}>
            <div
              className={s.articleCard}
              onClick={() => window.open(a.link, '_blank')}
            >
              <div className={s.articleStaticOverlay} />
              <div className={s.articleType}>
                <div className={`${s.articleDot} ${a.type === 'tech' ? s.articleDotTech : s.articleDotPersonal}`} />
                {a.type === 'tech' ? 'Technical' : 'Personal'}
              </div>
              <div className={s.articleTitle}>{a.title}</div>
              <p className={s.articleExcerpt}>{a.excerpt}</p>
              <a
                href={a.link}
                target="_blank"
                rel="noreferrer"
                className={s.articleReadMore}
                onClick={e => e.stopPropagation()}
              >
                Read on Medium ↗
              </a>
              <div className={s.articleReadTime}>⏱ {readingTimes[i] || '5 min read'}</div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  )
}

// ── CONTACT ──
export function Contact() {

  return (
    <section className="section" id="contact" style={{ background: 'linear-gradient(180deg,var(--void) 0%,#010810 100%)' }}>
      <div>
        <div className="s-eye">Open Channel // Contact</div>
        <div className={s.contactTitle}>
          Let's<br /><em className={s.contactAccent}>Connect</em>
        </div>
        <p className={s.contactDesc}>
          Available for applied AI, data platform, and production ML conversations.
          Focused on systems where reliability, governance, and measurable impact matter.
        </p>
        <div className={s.contactLinks} style={{ maxWidth: 600 }}>
          {[
            { icon: '📞', lbl: 'Phone',    val: PERSONAL.phone,    href: `tel:${PERSONAL.phone}` },
            { icon: '✉',  lbl: 'Email',    val: PERSONAL.email,    href: `mailto:${PERSONAL.email}` },
            { icon: 'in', lbl: 'LinkedIn', val: '/in/dharmik-soni-a385131a0', href: PERSONAL.linkedin },
            { icon: '⌥',  lbl: 'GitHub',  val: 'github.com/Dharmik2510', href: PERSONAL.github },
            { icon: 'M',  lbl: 'Medium',  val: '@dhsoni2510', href: PERSONAL.medium },
          ].map(c => (
            <a
              key={c.lbl}
              href={c.href}
              target={c.href.startsWith('http') ? '_blank' : undefined}
              rel="noreferrer"
              className={s.contactLink}
              aria-label={`${c.lbl}: ${c.val}`}
            >
              <div className={s.contactLinkIcon}>{c.icon}</div>
              <div>
                <div className={s.contactLinkLabel}>{c.lbl}</div>
                <div className={s.contactLinkVal}>{c.val}</div>
              </div>
              <div className={s.contactLinkArrow}>→</div>
            </a>
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
