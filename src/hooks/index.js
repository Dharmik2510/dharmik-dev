import { useEffect, useRef, useState, useCallback } from 'react'
import * as THREE from 'three'

// ── CURSOR HOOK ──
export function useCursor() {
  const outerRef = useRef(null)
  const innerRef = useRef(null)
  const pos = useRef({ ox: 0, oy: 0, tx: 0, ty: 0 })
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Disable custom cursor on touch devices
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const onMove = (e) => {
      pos.current.tx = e.clientX
      pos.current.ty = e.clientY
      if (innerRef.current) {
        innerRef.current.style.left = e.clientX + 'px'
        innerRef.current.style.top  = e.clientY + 'px'
        innerRef.current.style.transform = 'translate(-50%,-50%)'
      }
    }

    const onMouseOver = (e) => {
      // Find semantic interactive elements
      const target = e.target.closest('a, button, [role="button"], .chip')
      setHovering(!!target)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseover', onMouseOver)

    let raf
    const tick = () => {
      pos.current.ox += (pos.current.tx - pos.current.ox) * 0.13
      pos.current.oy += (pos.current.ty - pos.current.oy) * 0.13
      if (outerRef.current) {
        outerRef.current.style.left = pos.current.ox + 'px'
        outerRef.current.style.top  = pos.current.oy + 'px'
        outerRef.current.style.transform = 'translate(-50%,-50%)'
      }
      raf = requestAnimationFrame(tick)
    }
    tick()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onMouseOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  return { outerRef, innerRef, hovering, setHovering }
}

// ── LIVE CLOCK HOOK ──
export function useClock() {
  const [time, setTime] = useState('')

  useEffect(() => {
    const update = () => {
      setTime(
        new Date().toLocaleTimeString('en-CA', {
          hour12: false,
          timeZone: 'America/Toronto',
        })
      )
    }
    update()
    const id = setInterval(update, 1000)
    return () => clearInterval(id)
  }, [])

  return time
}

// ── SCROLL FADE HOOK ──
export function useScrollFade(threshold = 0.08) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

// ── SCROLL PROGRESS HOOK ──
export function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY
      const docH = document.documentElement.scrollHeight - window.innerHeight
      setProgress(docH > 0 ? scrollTop / docH : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}

// ── THEME HOOK ──
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('portfolio-theme') || 'dark'
    }
    return 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}

// ── MAGNETIC HOVER HOOK ──
export function useMagnetic(strength = 0.3) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const isTouch = window.matchMedia('(pointer: coarse)').matches
    if (isTouch) return

    const onMove = (e) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      el.style.transform = `translate(${dx}px, ${dy}px)`
      el.style.transition = 'transform 0.15s ease-out'
    }
    const onLeave = () => {
      el.style.transform = 'translate(0,0)'
      el.style.transition = 'transform 0.4s cubic-bezier(.16,1,.3,1)'
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}

// ── VISIBLE PAUSE HOOK (performance) ──
export function useVisiblePause(callback, deps = []) {
  const ref = useRef(null)
  const isVisible = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => { isVisible.current = entry.isIntersecting },
      { threshold: 0.05 }
    )
    obs.observe(el)

    const loop = (...args) => {
      if (isVisible.current) {
        callback(...args)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)

    return () => {
      obs.disconnect()
      cancelAnimationFrame(rafRef.current)
    }
  }, deps)

  return ref
}

// ── GITHUB ACTIVITY HOOK ──
export function useGithubActivity(username = 'Dharmik2510') {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetch(`https://api.github.com/users/${username}/events/public?per_page=5`)
      .then(r => r.ok ? r.json() : [])
      .then(events => {
        const commits = events
          .filter(e => e.type === 'PushEvent')
          .slice(0, 3)
          .map(e => ({
            repo: e.repo.name.split('/')[1],
            message: e.payload.commits?.[0]?.message?.slice(0, 60) || 'Update',
            date: new Date(e.created_at).toLocaleDateString('en-CA'),
          }))
        setData(commits)
      })
      .catch(() => setData(null))
  }, [username])

  return data
}

// ── TIME SINCE LANDING HOOK ──
export function useTimeSince(dateStr = '2021-09-01') {
  const [elapsed, setElapsed] = useState('')

  useEffect(() => {
    const target = new Date(dateStr)
    const update = () => {
      const now = new Date()
      const diff = now - target
      const years = Math.floor(diff / (365.25 * 86400000))
      const months = Math.floor((diff % (365.25 * 86400000)) / (30.44 * 86400000))
      const days = Math.floor((diff % (30.44 * 86400000)) / 86400000)
      setElapsed(`${years}y ${months}m ${days}d`)
    }
    update()
    const id = setInterval(update, 60000)
    return () => clearInterval(id)
  }, [dateStr])

  return elapsed
}

// ── THREE.JS COSMOS HOOK ──
export function useThreeCosmos(canvasRef) {
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const W = window.innerWidth, H = window.innerHeight
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(W, H)

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(60, W / H, 0.1, 1000)
    camera.position.z = 80

    const mkP = (n, range, col, sz, op) => {
      const g = new THREE.BufferGeometry()
      const pos = new Float32Array(n * 3)
      for (let i = 0; i < n; i++) {
        pos[i*3]   = (Math.random() - .5) * range
        pos[i*3+1] = (Math.random() - .5) * range
        pos[i*3+2] = (Math.random() - .5) * range * .5
      }
      g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
      return new THREE.Points(g, new THREE.PointsMaterial({ color: col, size: sz, sizeAttenuation: true, transparent: true, opacity: op }))
    }

    const stars  = mkP(2800, 380, 0x4a8ab5, .28, .55)
    const neons  = mkP(160, 200, 0x00e5ff, .5, .3)
    const ambers = mkP(70, 160, 0xffab00, .4, .2)
    scene.add(stars); scene.add(neons); scene.add(ambers)

    const arcMat = new THREE.LineBasicMaterial({ color: 0x00e5ff, transparent: true, opacity: .07 })
    ;[
      [new THREE.Vector3(-55,-18,0), new THREE.Vector3(-5,28,18), new THREE.Vector3(42,8,0)],
      [new THREE.Vector3(-45,-8,8),  new THREE.Vector3(5,-28,3),  new THREE.Vector3(48,4,-4)],
    ].forEach(pts => {
      const curve = new THREE.CatmullRomCurve3(pts)
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(curve.getPoints(70)), arcMat))
    })

    let mx = 0, my = 0
    const onMove = (e) => {
      mx = (e.clientX / window.innerWidth - .5) * 2
      my = -(e.clientY / window.innerHeight - .5) * 2
    }
    window.addEventListener('mousemove', onMove)

    // Visibility-based pause
    let visible = true
    const obs = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting || entry.intersectionRatio > 0
    }, { threshold: 0 })
    obs.observe(canvas)

    let raf
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (!visible) return
      const t = Date.now() * .00018
      stars.rotation.y  = t * .05 + mx * .025
      stars.rotation.x  = t * .018 + my * .018
      neons.rotation.y  = -t * .07 + mx * .04
      neons.rotation.x  = t * .035
      ambers.rotation.y = t * .04 - mx * .02
      ambers.rotation.z = t * .02
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      obs.disconnect()
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', onResize)
      renderer.dispose()
    }
  }, [])
}
