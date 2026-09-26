// Adapted from motion-primitives TextScramble (MIT) — https://motion-primitives.com/docs/text-scramble
// Re-runs whenever `children` changes or `trigger` flips true: a split-flap departure board.
import React, { useEffect, useRef, useState } from 'react'

const DEFAULT_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

export function TextScramble({
  children,
  duration = 0.8,
  speed = 0.04,
  characterSet = DEFAULT_CHARS,
  as: Tag = 'p',
  className,
  trigger = true,
  onScrambleComplete,
  ...props
}) {
  const text = String(children)
  const [display, setDisplay] = useState(text)
  const timer = useRef(null)

  useEffect(() => {
    if (!trigger) { setDisplay(text); return }
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) { setDisplay(text); return }
    const steps = duration / speed
    let step = 0
    clearInterval(timer.current)
    timer.current = setInterval(() => {
      const p = step / steps
      let out = ''
      for (let i = 0; i < text.length; i++) {
        const c = text[i]
        if (c === ' ' || c === '·' || c === '→' || c === '—') { out += c; continue }
        out += p * text.length > i ? c : characterSet[Math.floor(Math.random() * characterSet.length)]
      }
      setDisplay(out)
      step++
      if (step > steps) {
        clearInterval(timer.current)
        setDisplay(text)
        onScrambleComplete?.()
      }
    }, speed * 1000)
    return () => clearInterval(timer.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text, trigger])

  return (
    <Tag className={className} aria-label={text} {...props}>
      <span aria-hidden="true">{display}</span>
    </Tag>
  )
}

export default TextScramble
