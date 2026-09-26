// Adapted from motion-primitives TextEffect (MIT) — https://motion-primitives.com/docs/text-effect
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'

const STAGGER = { char: 0.03, word: 0.05, line: 0.1 }

const container = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  exit: { transition: { staggerChildren: 0.05, staggerDirection: -1 } },
}

const PRESETS = {
  blur: {
    hidden: { opacity: 0, filter: 'blur(12px)' },
    visible: { opacity: 1, filter: 'blur(0px)' },
    exit: { opacity: 0, filter: 'blur(12px)' },
  },
  'fade-in-blur': {
    hidden: { opacity: 0, y: 20, filter: 'blur(12px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -12, filter: 'blur(12px)' },
  },
  scale: {
    hidden: { opacity: 0, scale: 0 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0 },
  },
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
}

const withTransition = (variants, transition) => ({
  ...variants,
  visible: { ...variants.visible, transition: { ...(variants.visible?.transition || {}), ...transition } },
  exit: { ...variants.exit, transition: { ...(variants.exit?.transition || {}), ...transition, staggerDirection: -1 } },
})

const Segment = React.memo(function Segment({ segment, variants, per }) {
  // plain whitespace so lines wrap naturally (no inline-block indent on the next line)
  if (per !== 'line' && /^\s+$/.test(segment)) return segment
  if (per === 'line') {
    return <motion.span variants={variants} className="mp-block">{segment}</motion.span>
  }
  if (per === 'word') {
    return <motion.span aria-hidden="true" variants={variants} className="mp-inline">{segment}</motion.span>
  }
  return (
    <span className="mp-inline">
      {segment.split('').map((ch, i) => (
        <motion.span key={i} aria-hidden="true" variants={variants} className="mp-inline">{ch}</motion.span>
      ))}
    </span>
  )
})

export function TextEffect({
  children,
  per = 'word',
  as = 'p',
  className,
  preset = 'fade',
  delay = 0,
  speedReveal = 1,
  speedSegment = 1,
  trigger = true,
  style,
  onAnimationComplete,
}) {
  const text = String(children)
  const segments = per === 'line' ? text.split('\n') : text.split(/(\s+)/)
  const Tag = motion[as] || motion.p
  const stagger = STAGGER[per] / speedReveal

  const containerVariants = withTransition(container, {
    staggerChildren: stagger,
    delayChildren: delay,
  })
  containerVariants.exit = { transition: { staggerChildren: stagger / 2, staggerDirection: -1 } }
  const itemVariants = withTransition(PRESETS[preset] || PRESETS.fade, { duration: 0.3 / speedSegment })

  return (
    <AnimatePresence mode="popLayout">
      {trigger && (
        <Tag
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={containerVariants}
          className={className}
          style={style}
          onAnimationComplete={onAnimationComplete}
        >
          {per !== 'line' && <span className="mp-sr-only">{text}</span>}
          {segments.map((seg, i) => (
            <Segment key={`${per}-${i}-${seg}`} segment={seg} variants={itemVariants} per={per} />
          ))}
        </Tag>
      )}
    </AnimatePresence>
  )
}

export default TextEffect
