import React, { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { PERSONAL, ROUTE } from '../data'
import styles from './Hero.module.css'

function BoardingPass() {
  const cardRef = useRef(null)

  // 3D tilt on mouse move
  useEffect(() => {
    const card = cardRef.current
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
    ctx.fillText('AMD-YHZ-YUL-YYZ', W / 2, H)
  }, [])

  return (
    <motion.div
      className={styles.bpWrap}
      initial={{ opacity: 0, y: 30, rotate: 5 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 1.2, delay: 0.65, ease: [.16,1,.3,1] }}
      style={{ perspective: 900 }}
    >
      <div className={styles.bpShadow} />
      <div className={styles.bp} ref={cardRef}>
        <div className={styles.bpGlint} />
        <div className={`${styles.bpPerf} ${styles.bpPerfTop}`} />
        <div className={`${styles.bpPerf} ${styles.bpPerfBot}`} />
        <div className={`${styles.bpNotch} ${styles.bpNlt}`} />
        <div className={`${styles.bpNotch} ${styles.bpNrt}`} />
        <div className={`${styles.bpNotch} ${styles.bpNlb}`} />
        <div className={`${styles.bpNotch} ${styles.bpNrb}`} />

        {/* Header */}
        <div className={styles.bpHd}>
          <div>
            <div className={styles.bpAirline}>✦ DEVAIR</div>
            <div className={styles.bpAirlineSub}>// AI DEVELOPER AIRLINES</div>
          </div>
          <div className={styles.bpClass}>AI CLASS</div>
        </div>

        {/* Route */}
        <div className={styles.bpRoute}>
          <div className={styles.bpCity}>
            <div className={styles.bpIata}>AMD</div>
            <div className={styles.bpCityName}>Ahmedabad</div>
            <div className={styles.bpCityCountry}>INDIA 🇮🇳</div>
          </div>
          <div className={styles.bpMid}>
            <div className={styles.bpArc}>
              <div className={styles.bpArcDot} />
              <div className={styles.bpArcLine} />
              <div className={styles.bpArcDot} />
            </div>
            <div className={styles.bpPlaneIco}>✈</div>
            <div className={styles.bpKm}>11,830 KM</div>
          </div>
          <div className={styles.bpCity}>
            <div className={`${styles.bpIata} ${styles.bpIataDest}`}>YYZ</div>
            <div className={styles.bpCityName}>Toronto</div>
            <div className={styles.bpCityCountry}>CANADA 🇨🇦</div>
          </div>
        </div>

        {/* Details grid */}
        <div className={styles.bpDet}>
          {[
            { lbl: 'Flight',   val: 'DS-2024',  cls: 'c1' },
            { lbl: 'Via',      val: 'YHZ·YUL',  cls: 'c2' },
            { lbl: 'Status',   val: 'LANDED',    cls: 'c3' },
            { lbl: 'Departed', val: '2021',      cls: ''   },
            { lbl: 'Gate',     val: 'AI-∞',      cls: 'c1' },
            { lbl: 'Role',     val: 'DEV II',    cls: 'c2' },
          ].map(d => (
            <div key={d.lbl}>
              <div className={styles.bpDLbl}>{d.lbl}</div>
              <div className={`${styles.bpDVal} ${d.cls === 'c1' ? styles.bpDValC1 : d.cls === 'c2' ? styles.bpDValC2 : d.cls === 'c3' ? styles.bpDValC3 : ''}`}>{d.val}</div>
            </div>
          ))}
        </div>

        {/* Passenger */}
        <div className={styles.bpPax}>
          <div>
            <div className={styles.bpPaxLbl}>PASSENGER</div>
            <div className={styles.bpPaxName}>DHARMIK SONI</div>
            <div className={styles.bpPaxRole}>AI Developer II · Intact</div>
          </div>
          <div className={styles.bpSeat}>
            <div className={styles.bpSeatLbl}>SEAT</div>
            <div className={styles.bpSeatNum}>01A</div>
          </div>
        </div>

        {/* Barcode */}
        <div className={styles.bpBar}>
          <canvas id="bp-barcode" width="82" height="42" />
          <div>
            <div className={styles.bpBarId}>BOARDING PASS ID</div>
            <div className={styles.bpBarNum}>AMD-YHZ-YUL-YYZ</div>
            <div className={styles.bpBarStatus}>
              <div className={styles.bpBarDot} />
              GATE OPEN · AI SYSTEMS ACTIVE
            </div>
          </div>
        </div>

        {/* Stub */}
        <div className={styles.bpStub}>
          <div>
            <div className={styles.bpStubRoute}>AMD → YYZ</div>
            <div className={styles.bpStubInfo}>INTACT FINANCIAL · 3+ YRS · AI DEVELOPER</div>
          </div>
          <div>
            <div className={styles.bpGateLbl}>GATE</div>
            <div className={styles.bpGateNum}>∞</div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

const fadeUp = (delay) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [.16,1,.3,1] },
})

export default function Hero() {
  return (
    <section className={styles.hero} id="home">
      {/* Left text */}
      <div className={styles.left}>
        <motion.div className={styles.eyebrow} {...fadeUp(.3)}>
          Boarding Pass // Dharmik Soni
        </motion.div>

        <div className={styles.nameWrap}>
          <div className={styles.nameGhost} aria-hidden>Dharmik<br />Soni</div>
          <motion.h1 className={styles.name} {...fadeUp(.44)}>
            Dharmik<br />Soni
          </motion.h1>
        </div>

        <motion.div className={styles.tagline} {...fadeUp(.58)}>
          AI Developer II
        </motion.div>
        <motion.div className={styles.company} {...fadeUp(.65)}>
          Intact Financial Corporation
        </motion.div>

        <motion.div className={styles.route} {...fadeUp(.72)}>
          {ROUTE.map((s, i) => (
            <React.Fragment key={s.code}>
              <span className={`${styles.rs} ${s.active ? styles.rsActive : ''}`}>
                {s.code} {s.flag}
              </span>
              {i < ROUTE.length - 1 && <span className={styles.ra}>→</span>}
            </React.Fragment>
          ))}
        </motion.div>

        <motion.p className={styles.desc} {...fadeUp(.8)}>
          From <strong>Ahmedabad, India</strong> to a Master's at{' '}
          <strong>Dalhousie, Halifax</strong>, an AI internship at{' '}
          <strong>Intact, Montréal</strong>, and now{' '}
          <strong>AI Developer II in Toronto</strong>. Building intelligent
          systems that drive real decisions at scale.
        </motion.p>

        <motion.div className={styles.ctas} {...fadeUp(.92)}>
          <a href="#experience" className="btn-p">View Experience →</a>
          <a href="https://github.com/Dharmik2510" target="_blank" rel="noreferrer" className="btn-g">GitHub ↗</a>
          <a href="mailto:dhsoni2510@gmail.com" className="btn-g">Contact</a>
        </motion.div>
      </div>

      {/* Right — boarding pass */}
      <div className={styles.right}>
        <BoardingPass />
      </div>

      {/* HUD strip */}
      <div className={styles.hud}>
        {[
          { lbl: 'Origin',      val: 'AMD',    sub: 'Ahmedabad, India'         },
          { lbl: 'Via',         val: 'YHZ',    sub: 'Halifax · Dalhousie'      },
          { lbl: 'Via',         val: 'YUL',    sub: 'Montréal · Intact'        },
          { lbl: 'Destination', val: 'YYZ',    sub: 'Toronto · Permanent'      },
          { lbl: 'Status',      val: 'ACTIVE', sub: 'AI Developer II', green: true },
        ].map((c, i) => (
          <div key={i} className={styles.hudCell}>
            <div className={styles.hudLbl}>{c.lbl}</div>
            <div className={`${styles.hudVal} ${c.green ? styles.hudValGreen : ''}`}>{c.val}</div>
            <div className={styles.hudSub}>{c.sub}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
