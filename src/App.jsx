import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScrollProgress from './components/ScrollProgress'
import Passage from './components/Passage'
import {
  ExploreStrip, ControlTower, About,
  Experience, Projects, Articles, Contact, Footer, SectionTransition
} from './components/Sections'
import { useCursor } from './hooks'
import { SmoothScroll, FilmGrain } from './components/cinema'

function Cursor() {
  const { outerRef, innerRef, hovering } = useCursor()
  return (
    <>
      <div ref={outerRef} className={`cursor-outer${hovering ? ' hov' : ''}`} />
      <div ref={innerRef} className="cursor-inner" />
    </>
  )
}

export default function App() {
  return (
    <>
      {/* Lenis smooth scrolling + film grain */}
      <SmoothScroll />
      <FilmGrain />

      {/* Overlays */}
      <div className="vignette" aria-hidden="true" />

      {/* Custom cursor (hidden on touch) */}
      <Cursor />

      {/* Skip to content (a11y) */}
      <a href="#home" className="skip-to-content">Skip to content</a>

      {/* Scroll progress */}
      <ScrollProgress />

      {/* Nav */}
      <Navbar />

      {/* Main content */}
      <main style={{ position: 'relative', zIndex: 10 }} id="main-content">
        <Hero />

        <ControlTower />

        {/* Journey — scroll-scrubbed film: Ahmedabad → Halifax → Montréal → Toronto */}
        <Passage />

        <SectionTransition icon="◆" />
        <About />

        <SectionTransition icon="⚡" />
        <Experience />

        <SectionTransition icon="🚀" />
        <Projects />

        <SectionTransition icon="📡" />
        <Articles />

        <SectionTransition icon="📨" />
        <Contact />

        <Footer />
      </main>

      {/* Fixed bottom strip */}
      <ExploreStrip />
    </>
  )
}
