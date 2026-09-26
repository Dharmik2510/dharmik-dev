// Adapted from motion-primitives InView (MIT) — https://motion-primitives.com/docs/in-view
import React, { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const DEFAULT = { hidden: { opacity: 0 }, visible: { opacity: 1 } }

export function InView({ children, variants = DEFAULT, transition, viewOptions, as = 'div', once, className, style }) {
  const ref = useRef(null)
  const inView = useInView(ref, viewOptions)
  const [seen, setSeen] = useState(false)
  const Tag = motion[as] || motion.div
  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      initial="hidden"
      animate={inView || seen ? 'visible' : 'hidden'}
      onAnimationComplete={() => { if (once && inView) setSeen(true) }}
      variants={variants}
      transition={transition}
    >
      {children}
    </Tag>
  )
}

export default InView
