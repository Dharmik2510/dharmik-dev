import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import CinematicVideo from './CinematicVideo'

export default function ChapterCardV2({ chapter }) {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [40, -40])
  const numberOpacity = useTransform(scrollYProgress, [0.1, 0.5], [0.3, 1])
  const scanlineY = useTransform(scrollYProgress, [0.2, 0.6], ['0%', '100%'])

  return (
    <motion.article ref={ref} className="chapter-card-v2">
      <CinematicVideo
        src={chapter.videoSrc}
        poster={chapter.posterSrc}
        opacity={0.18}
        blendMode="screen"
      />

      <motion.div className="cc-scanline" style={{ y: scanlineY }} />

      <header className="cc-head">
        <motion.div className="cc-num" style={{ opacity: numberOpacity }}>
          {chapter.chapter}
        </motion.div>
        <div className="cc-route">
          <span className="cc-code">{chapter.code}</span>
          <span className="cc-city">· {chapter.city}</span>
        </div>
      </header>

      <motion.h3 className="cc-title" style={{ y }}>
        {chapter.title}
      </motion.h3>

      <ul className="cc-kinetic">
        {chapter.kineticLines.map((line, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: i * 0.12, duration: 0.5 }}
          >
            {line}
          </motion.li>
        ))}
      </ul>

      <div className="cc-chips">
        {chapter.metricChips.map((c) => (
          <span key={c} className="cc-chip">{c}</span>
        ))}
      </div>
    </motion.article>
  )
}
