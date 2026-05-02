import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScrollProgress from './components/ScrollProgress'
import ChapterCardV2 from './components/ChapterCardV2'
import {
  ExploreStrip, Ticker, ControlTower, About,
  Experience, Projects, Articles, Contact, Footer, SectionTransition
} from './components/Sections'
import NeuralBackground from './components/NeuralBackground'
import { CHAPTERS } from './data/journey'
import { useCursor } from './hooks'

function Cursor() {
  const { outerRef, innerRef, hovering } = useCursor()
  return (
    <>
      <div ref={outerRef} className={`cursor-outer${hovering ? ' hov' : ''}`} />
      <div ref={innerRef} className="cursor-inner" />
    </>
  )
}

function JourneyV2() {
  return (
    <section id="journey" className="journey-v2">
      <div className="journey-v2-head">
        <div className="journey-v2-eye">// Career Narrative</div>
        <h2 className="journey-v2-title">Four chapters. One operating system.</h2>
      </div>

      <div className="journey-v2-cards">
        {CHAPTERS.map((chapter) => (
          <ChapterCardV2 key={chapter.id} chapter={chapter} />
        ))}
      </div>
    </section>
  )
}

export default function App() {
  return (
    <>
      {/* Neural particle background */}
      <NeuralBackground />

      {/* Overlays */}
      <div className="scanlines" aria-hidden="true" />
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
        <Ticker />

        <ControlTower />

        <SectionTransition icon="✈" />
        <JourneyV2 />

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
