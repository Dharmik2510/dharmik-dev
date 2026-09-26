// Adapted from motion-primitives SlidingNumber (MIT) — https://motion-primitives.com/docs/sliding-number
// Uses %-based offsets instead of react-use-measure, so no extra dependency.
import React, { useEffect } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

const SPRING = { stiffness: 280, damping: 18, mass: 0.3 }

function Num({ mv, number }) {
  const y = useTransform(mv, (latest) => {
    const place = latest % 10
    let off = (10 + number - place) % 10
    if (off > 5) off -= 10
    return `${off * 100}%`
  })
  return <motion.span className="mp-sn-num" style={{ y }}>{number}</motion.span>
}

function Digit({ value, place }) {
  const rounded = Math.floor(value / place) % 10
  const mv = useSpring(rounded, SPRING)
  useEffect(() => { mv.set(rounded) }, [mv, rounded])
  return (
    <span className="mp-sn-digit">
      <span className="mp-sn-ghost">0</span>
      {Array.from({ length: 10 }, (_, i) => <Num key={i} mv={mv} number={i} />)}
    </span>
  )
}

export function SlidingNumber({ value, padStart = 0, className = '' }) {
  const int = Math.floor(Math.abs(value))
  const digits = String(int).padStart(padStart, '0').split('')
  return (
    <span className={`mp-sn ${className}`} aria-label={String(int)}>
      {value < 0 && '-'}
      {digits.map((_, i) => {
        const place = Math.pow(10, digits.length - i - 1)
        return <Digit key={`p-${place}`} value={int} place={place} />
      })}
    </span>
  )
}

export default SlidingNumber
