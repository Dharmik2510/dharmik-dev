import React, { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useInView } from 'react-intersection-observer'
import styles from './ArticlesFeed.module.css'

const PAGE_SIZE = 6
const EASE = [0.16, 1, 0.3, 1]

function readTime(excerpt = '') {
  const mins = Math.round(excerpt.length / 40)
  return `${Math.min(9, Math.max(4, mins || 5))} min`
}

function pubLabel(pubDate) {
  const d = new Date(pubDate)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function pubYear(pubDate) {
  const d = new Date(pubDate)
  return Number.isNaN(d.getTime()) ? '' : String(d.getFullYear())
}

const FILTERS = [
  { id: 'all', label: 'All' },
  { id: 'tech', label: 'Technical' },
  { id: 'personal', label: 'Personal' },
]

function FadeIn({ children, delay = 0 }) {
  const { ref, inView } = useInView({ threshold: 0.08, triggerOnce: true })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60, rotateX: 12, filter: 'blur(8px)' }}
      animate={inView ? { opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' } : {}}
      transition={{ duration: 0.95, delay, ease: EASE }}
      style={{ transformPerspective: 900 }}
    >
      {children}
    </motion.div>
  )
}

function ArticleCard({ article, index, variant = 'grid' }) {
  const isFeatured = variant === 'featured'

  return (
    <a
      href={article.link}
      target="_blank"
      rel="noreferrer"
      className={`${styles.card} ${isFeatured ? styles.cardFeatured : ''}`}
    >
      <div className={styles.cardTop}>
        <span className={styles.tx}>
          TX·{String(index + 1).padStart(3, '0')}
        </span>
        <span className={styles.type}>
          <span
            className={`${styles.dot} ${
              article.type === 'tech' ? styles.dotTech : styles.dotPersonal
            }`}
          />
          {article.type === 'tech' ? 'Technical' : 'Personal'}
        </span>
      </div>
      <h3 className={styles.title}>{article.title}</h3>
      <p className={styles.excerpt}>{article.excerpt}</p>
      <div className={styles.cardFoot}>
        <span className={styles.metaItem}>{readTime(article.excerpt)} read</span>
        <span className={styles.metaDot} aria-hidden="true">·</span>
        <span className={styles.metaItem}>{pubLabel(article.pubDate)}</span>
        <span className={styles.read}>
          {isFeatured ? 'Read full article ↗' : 'Read ↗'}
        </span>
      </div>
    </a>
  )
}

export default function ArticlesFeed({ articles = [] }) {
  const [filter, setFilter] = useState('all')
  const [visible, setVisible] = useState(PAGE_SIZE)

  const stats = useMemo(() => {
    const tech = articles.filter((a) => a.type === 'tech').length
    const personal = articles.filter((a) => a.type === 'personal').length
    const years = [...new Set(articles.map((a) => pubYear(a.pubDate)).filter(Boolean))]
    return { total: articles.length, tech, personal, years }
  }, [articles])

  const filtered = useMemo(() => {
    if (filter === 'all') return articles
    return articles.filter((a) => a.type === filter)
  }, [articles, filter])

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const visibleRest = rest.slice(0, visible)
  const hasMore = visible < rest.length

  const onFilterChange = (id) => {
    setFilter(id)
    setVisible(PAGE_SIZE)
  }

  if (!articles.length) return null

  return (
    <div className={styles.feed}>
      <div className={styles.toolbar}>
        <div className={styles.stats}>
          <span className={styles.stat}>
            <b>{String(stats.total).padStart(2, '0')}</b> articles
          </span>
          <span className={styles.statSep} aria-hidden="true">/</span>
          <span className={styles.stat}>
            <b>{String(stats.tech).padStart(2, '0')}</b> technical
          </span>
          {stats.personal > 0 && (
            <>
              <span className={styles.statSep} aria-hidden="true">/</span>
              <span className={styles.stat}>
                <b>{String(stats.personal).padStart(2, '0')}</b> personal
              </span>
            </>
          )}
          {stats.years.length > 0 && (
            <>
              <span className={styles.statSep} aria-hidden="true">/</span>
              <span className={styles.stat}>
                {stats.years.sort().join(' · ')}
              </span>
            </>
          )}
        </div>

        <div className={styles.filters} role="tablist" aria-label="Filter articles">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              role="tab"
              aria-selected={filter === f.id}
              className={`${styles.filterBtn} ${filter === f.id ? styles.filterBtnActive : ''}`}
              onClick={() => onFilterChange(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {featured && (
        <FadeIn>
          <ArticleCard article={featured} index={articles.indexOf(featured)} variant="featured" />
        </FadeIn>
      )}

      {visibleRest.length > 0 && (
        <div className={styles.grid}>
          {visibleRest.map((article) => (
            <FadeIn key={article.link} delay={0.04}>
              <ArticleCard
                article={article}
                index={articles.indexOf(article)}
                variant="grid"
              />
            </FadeIn>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className={styles.empty}>No articles in this category yet.</p>
      )}

      {hasMore && (
        <div className={styles.moreWrap}>
          <button
            type="button"
            className={styles.moreBtn}
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
          >
            Load {Math.min(PAGE_SIZE, rest.length - visible)} more
            <span className={styles.moreCount}>
              {visibleRest.length + 1} / {filtered.length}
            </span>
          </button>
        </div>
      )}
    </div>
  )
}
