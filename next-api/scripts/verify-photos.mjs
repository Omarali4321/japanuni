#!/usr/bin/env node
// Verifies university photo candidates against the Wikimedia Commons API and
// writes only existing files (with API-provided URLs and license) to the mapping.
// Usage: node scripts/verify-photos.mjs [candidates.json ...]
// Default input/output: data/university-photos-mapping.json. Run `npm run build` afterwards.
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA = join(import.meta.dirname, '..', 'data')
const OUT = join(DATA, 'university-photos-mapping.json')
const UA = 'japanuni-photo-verifier/1.0 (https://japanuni.vercel.app)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const inputs = process.argv.slice(2)
const candidates = {}
for (const file of inputs.length ? inputs : [OUT]) Object.assign(candidates, JSON.parse(readFileSync(file, 'utf8')))

const knownKeys = new Set(JSON.parse(readFileSync(join(DATA, 'universities-index.json'), 'utf8')).map((u) => u.sourceKey))

// File name from a Commons URL: .../thumb/a/ab/Name.jpg/1200px-Name.jpg, .../a/ab/Name.jpg, or File:Name.jpg
function fileName(entry) {
  for (const url of [entry.photoUrl, entry.sourceUrl]) {
    if (!url) continue
    const file = url.match(/\/wiki\/File:([^?#]+)/)
    if (file) return decodeURIComponent(file[1]).replace(/_/g, ' ')
    const thumb = url.match(/\/commons\/thumb\/[0-9a-f]\/[0-9a-f]{2}\/([^/]+)\//)
    if (thumb) return decodeURIComponent(thumb[1]).replace(/_/g, ' ')
    const direct = url.match(/\/commons\/[0-9a-f]\/[0-9a-f]{2}\/([^/?#]+)$/)
    if (direct) return decodeURIComponent(direct[1]).replace(/_/g, ' ')
  }
  return null
}

const strip = (html) => (html || '').replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim()

async function api(titles) {
  const params = new URLSearchParams({
    action: 'query', format: 'json', formatversion: '2', prop: 'imageinfo',
    iiprop: 'url|extmetadata', iiurlwidth: '1200', titles: titles.map((t) => `File:${t}`).join('|'),
  })
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { 'User-Agent': UA } })
    if (res.ok) return res.json()
    await sleep(2000 * (attempt + 1))
  }
  throw new Error('Commons API unavailable')
}

const entries = Object.entries(candidates)
const byFile = new Map()
const rejected = []
for (const [key, entry] of entries) {
  if (!knownKeys.has(key)) { rejected.push([key, 'unknown university key']); continue }
  const name = fileName(entry)
  if (!name) { rejected.push([key, 'no Commons file name']); continue }
  byFile.set(name, [...(byFile.get(name) || []), key])
}

const info = new Map()
const names = [...byFile.keys()]
for (let i = 0; i < names.length; i += 50) {
  const body = await api(names.slice(i, i + 50))
  const norm = new Map((body.query.normalized || []).map((n) => [n.to, n.from]))
  for (const page of body.query.pages) {
    const original = (norm.get(page.title) || page.title).replace(/^File:/, '')
    info.set(original, page.missing ? null : page.imageinfo?.[0] ?? null)
  }
  await sleep(1000)
}

const result = {}
for (const [name, keys] of byFile) {
  const ii = info.get(name)
  for (const key of keys) {
    if (!ii?.thumburl) { rejected.push([key, `missing on Commons: ${name}`]); continue }
    const meta = ii.extmetadata || {}
    const license = strip(meta.LicenseShortName?.value) || candidates[key].license || 'See source'
    const artist = strip(meta.Artist?.value) || 'Unknown author'
    result[key] = {
      photoUrl: ii.thumburl,
      sourceUrl: ii.descriptionurl,
      license,
      attribution: `${artist}, ${license}, via Wikimedia Commons`,
      altText: candidates[key].altText || name.replace(/\.[a-z]+$/i, ''),
      verified: true,
    }
  }
}

// Confirm each image URL actually loads
for (const [key, entry] of Object.entries(result)) {
  const res = await fetch(entry.photoUrl, { method: 'HEAD', headers: { 'User-Agent': UA } }).catch(() => null)
  if (!res?.ok || !res.headers.get('content-type')?.startsWith('image/')) {
    rejected.push([key, `image not loadable (${res?.status ?? 'network'})`])
    delete result[key]
  }
  await sleep(150)
}

const sorted = Object.fromEntries(Object.entries(result).sort(([a], [b]) => a.localeCompare(b)))
writeFileSync(OUT, JSON.stringify(sorted, null, 2) + '\n')
console.log(`Verified: ${Object.keys(sorted).length}/${entries.length}`)
for (const [key, reason] of rejected) console.log(`  rejected ${key}: ${reason}`)
