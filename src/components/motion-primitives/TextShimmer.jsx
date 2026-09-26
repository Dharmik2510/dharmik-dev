// Adapted from motion-primitives TextShimmer (MIT) — https://motion-primitives.com/docs/text-shimmer
import React from 'react'
import { motion } from 'framer-motion'

export function TextShimmer({ children, as = 'p', className = '', duration = 2, spread = 2 }) {
  const Tag = motion[as] || motion.p
  const text = String(children)
  return (
    <Tag
      className={`mp-shimmer ${className}`}
      initial={{ backgroundPosition: '100% center' }}
      animate={{ backgroundPosition: '0% center' }}
      transition={{ repeat: Infinity, duration, ease: 'linear' }}
      style={{ '--spread': `${text.length * spread}px` }}
    >
      {text}
    </Tag>
  )
}

export default TextShimmer
