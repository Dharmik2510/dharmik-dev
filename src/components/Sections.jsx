import React, { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import {
  WAYPOINTS, SKILLS, CERTIFICATIONS, EDUCATION,
  EXPERIENCE, PROJECTS, ARTICLES, TICKER_ITEMS, PERSONAL
} from '../data'
import Globe from './Globe'
import s from './Sections.module.css'

// ── SKILL PROFICIENCY DATA ──
const SKILL_BARS = [
  { label: 'Apache Kafka', pct: 92, cls: 'c1' },
  { label: 'Databricks/Spark', pct: 90, cls: 'c1' },
  { label: 'Python', pct: 95, cls: 'c2' },
  { label: 'Deep Learning', pct: 82, cls: 'c1' },
  { label: 'AWS Cloud', pct: 78, cls: 'c3' },
  { label: 'React/Node', pct: 75, cls: 'c2' },
  { label: 'Java', pct: 80, cls: 'c4' },
  { label: 'NLP / LLMs', pct: 85, cls: 'c1' },
]

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
        { ico: '📍', lbl: 'Origin',   val: 'Ahmedabad, India (AMD)' },
        { ico: '🎓', lbl: 'Masters',  val: 'Dalhousie University, Halifax' },
        { ico: '🏢', lbl: 'Company',  val: 'Intact Financial Corporation' },
        { ico: '📅', lbl: 'Location', val: 'Toronto, Canada · Open to Collaborate' },
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

// ── JOURNEY ──
export function Journey() {
  const [activeCity, setActiveCity] = useState(null);

  return (
    <section id="journey" className={s.journey}>
      <div className={s.journeyLeft}>
        <div className="s-eye">Flight Path // Life Route</div>
        <h2 className="s-title" style={{ fontSize: 'clamp(38px,5.5vw,74px)', marginBottom: 32 }}>
          The<br /><em>Journey</em>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }} onMouseLeave={() => setActiveCity(null)}>
          {WAYPOINTS.map((wp, i) => (
            <WaypointWrapper key={wp.code} onInView={() => setActiveCity(wp.code)}>
              <FadeUp delay={i * .08}>
                <SpotlightCard
                  className={`${s.wpCard} ${wp.type === 'origin' ? s.wpCardOrigin : wp.type === 'dest' ? s.wpCardDest : s.wpCardTransit}`}
                >
                  <div className={s.wpHeader}>
                    <div className={s.wpCode}>{wp.code}</div>
                    <div className={`${s.wpBadge} ${wp.type === 'origin' ? s.wpBadgeOrigin : wp.type === 'dest' ? s.wpBadgeDest : s.wpBadgeTransit}`}>
                      {wp.badge}
                    </div>
                  </div>
                  <div className={s.wpCity}>{wp.city}</div>
                  <p className={s.wpDesc}>{wp.desc}</p>
                </SpotlightCard>
              </FadeUp>
            </WaypointWrapper>
          ))}
        </div>
      </div>
      <div className={s.journeyGlobe}>
        <Globe activeCity={activeCity} />
      </div>
    </section>
  )
}

// ── ANIMATED SKILL BARS ──
function SkillBars() {
  const { ref, inView } = useInView({ threshold: 0.2, triggerOnce: true })
  return (
    <div ref={ref} className={s.skillBar}>
      {SKILL_BARS.map((skill) => (
        <div key={skill.label} className={s.skillBarItem}>
          <span className={s.skillBarLabel}>{skill.label}</span>
          <div className={s.skillBarTrack}>
            <div
              className={`${s.skillBarFill} ${s[`skillBarFill${skill.cls.charAt(0).toUpperCase() + skill.cls.slice(1)}`]}`}
              style={{ width: inView ? `${skill.pct}%` : '0%' }}
            />
          </div>
        </div>
      ))}
    </div>
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
            `I'm <strong>Dharmik Soni</strong> — an AI Developer with a passion for building intelligent systems that push the boundaries of technology. Currently serving as <strong>AI Developer II at Intact Financial Corporation</strong> in Toronto.`,
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
            {SKILLS.map(row => (
              <div key={row.label}>
                <div className={s.skillLabel}>
                  {row.label}
                  <div className={s.skillDivider} />
                </div>
                <div className={s.skillTags}>
                  {row.skills.map(sk => (
                    <span key={sk} className={`chip ${row.cls}`}>{sk}</span>
                  ))}
                </div>
              </div>
            ))}

            {/* Animated Skill Bars */}
            <div>
              <div className={s.skillLabel}>
                Proficiency
                <div className={s.skillDivider} />
              </div>
              <SkillBars />
            </div>
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
          AI collaboration, career development, tech discussions, or just want to say hi — all channels open. Based in Toronto, building globally.
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
        © 2026 // DHARMIK SONI // AI DEVELOPER II // INTACT FINANCIAL
      </div>
      <div className={s.footerRight}>
        <span>AMD → YHZ → YUL → YYZ</span>
      </div>
    </footer>
  )
}

// ── SECTION TRANSITION (exported) ──
export { SectionTransition }
