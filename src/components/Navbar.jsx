import React, { useState } from 'react'
import { useClock } from '../hooks'
import styles from './Navbar.module.css'

const NAV_LINKS = [
  { label: 'Impact',     href: '#impact'     },
  { label: 'Journey',    href: '#journey'    },
  { label: 'About',      href: '#about'      },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects',   href: '#projects'   },
  { label: 'Articles',   href: '#articles'   },
  { label: 'Contact',    href: '#contact'    },
]

export default function Navbar() {
  const time = useClock()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <nav className={styles.nav} role="navigation" aria-label="Main navigation">
      <div className={styles.logo}>
        <div className={styles.logoIco}>DS</div>
        DHARMIK<span className={styles.logoAccent}>SONI</span>
      </div>

      {/* Desktop links */}
      <ul className={styles.links}>
        {NAV_LINKS.map(l => (
          <li key={l.href}>
            <a href={l.href} className={styles.link}>{l.label}</a>
          </li>
        ))}
      </ul>

      <div className={styles.right}>
        <span className={styles.clock}>LOCAL {time}</span>

        <div className={styles.badge}>
          <div className={styles.pdot} />
          AI DEVELOPER II
        </div>

        {/* Hamburger (mobile) */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles.hamburgerOpen : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className={styles.mobileMenu}>
          <ul className={styles.mobileLinks}>
            {NAV_LINKS.map(l => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={styles.mobileLink}
                  onClick={() => setMenuOpen(false)}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className={styles.mobileFooter}>
            <span className={styles.clock}>LOCAL {time}</span>
            <div className={styles.badge}>
              <div className={styles.pdot} />
              AI DEVELOPER II
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
