#!/usr/bin/env node
// Fetches Medium RSS, writes normalized article list to src/data/articles.json.
// Zero npm deps. Requires Node 18+ (built-in fetch). Safe on failure: keeps
// existing JSON if present, only exits non-zero when no JSON exists at all.

import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT_PATH = resolve(__dirname, '../src/data/articles.json')
const USERNAME = process.env.MEDIUM_USERNAME || 'dhsoni2510'
const FEED_URL = `https://medium.com/feed/@${USERNAME}`
const MAX_ITEMS = 8
const EXCERPT_LEN = 200

const PERSONAL_KEYWORDS = [
  'life', 'personal', 'journey', 'story', 'reflection', 'career',
  'lessons', 'experience', 'thoughts', 'travel', 'immigration',
]

function warn(msg, err) {
  const detail = err ? `: ${err.message || err}` : ''
  console.warn(`[fetch-articles] ${msg}${detail}`)
}

function fallbackOrExit() {
  if (existsSync(OUT_PATH)) {
    warn(`keeping existing ${OUT_PATH}`)
    process.exit(0)
  }
  console.error('[fetch-articles] no existing JSON to fall back to — failing build')
  process.exit(1)
}

function decodeEntities(str) {
  return str
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
}

function unwrapCData(str) {
  const m = str.match(/^<!\[CDATA\[([\s\S]*?)\]\]>$/)
  return m ? m[1] : str
}

function pickTag(itemXml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'i')
  const m = itemXml.match(re)
  return m ? unwrapCData(m[1]).trim() : ''
}

function pickAllTags(itemXml, tag) {
  const re = new RegExp(`<${tag}(?:\\s[^>]*)?>([\\s\\S]*?)</${tag}>`, 'gi')
  const out = []
  let m
  while ((m = re.exec(itemXml)) !== null) {
    out.push(unwrapCData(m[1]).trim())
  }
  return out
}

function stripHtml(html) {
  return decodeEntities(
    html
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<[^>]+>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

function truncate(str, max) {
  if (str.length <= max) return str
  const cut = str.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd() + '…'
}

function classify(categories) {
  const lower = categories.map((c) => c.toLowerCase())
  const hit = lower.some((c) =>
    PERSONAL_KEYWORDS.some((kw) => c.includes(kw))
  )
  return hit ? 'personal' : 'tech'
}

function parseItems(xml) {
  const items = []
  const re = /<item\b[^>]*>([\s\S]*?)<\/item>/gi
  let m
  while ((m = re.exec(xml)) !== null) {
    const body = m[1]
    const title = decodeEntities(pickTag(body, 'title'))
    const link = decodeEntities(pickTag(body, 'link'))
    const pubDate = pickTag(body, 'pubDate')
    const contentRaw =
      pickTag(body, 'content:encoded') || pickTag(body, 'description')
    const categories = pickAllTags(body, 'category').map(decodeEntities)
    if (!title || !link) continue
    const excerpt = truncate(stripHtml(contentRaw), EXCERPT_LEN)
    items.push({
      type: classify(categories),
      title,
      excerpt,
      link,
      pubDate,
    })
  }
  return items
}

async function main() {
  let xml
  try {
    const res = await fetch(FEED_URL, {
      headers: { 'User-Agent': 'dharmik-dev-portfolio/1.0 (+github-actions)' },
    })
    if (!res.ok) {
      warn(`feed responded ${res.status}`)
      return fallbackOrExit()
    }
    xml = await res.text()
  } catch (err) {
    warn('fetch failed', err)
    return fallbackOrExit()
  }

  let items
  try {
    items = parseItems(xml).slice(0, MAX_ITEMS)
  } catch (err) {
    warn('parse failed', err)
    return fallbackOrExit()
  }

  if (items.length === 0) {
    warn('no items parsed from feed')
    return fallbackOrExit()
  }

  const existing = existsSync(OUT_PATH) ? readFileSync(OUT_PATH, 'utf8') : ''
  const next = JSON.stringify(items, null, 2) + '\n'
  if (existing === next) {
    console.log(`[fetch-articles] no changes (${items.length} items)`)
    return
  }
  writeFileSync(OUT_PATH, next)
  console.log(`[fetch-articles] wrote ${items.length} items to ${OUT_PATH}`)
}

main()
