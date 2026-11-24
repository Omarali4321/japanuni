#!/usr/bin/env node
// Finds photo candidates for universities without a photo via Wikidata (P18 "image").
// Only exact label/alias matches of entities located in Japan (P17 = Q17) are accepted.
// Output: candidates JSON for scripts/verify-photos.mjs.
// Usage: node scripts/find-photos.mjs <out.json>
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const DATA = join(import.meta.dirname, '..', 'data')
const UA = 'japanuni-photo-finder/1.0 (https://japanuni.vercel.app)'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const out = process.argv[2]
if (!out) throw new Error('Usage: node scripts/find-photos.mjs <out.json>')

const mapping = JSON.parse(readFileSync(join(DATA, 'university-photos-mapping.json'), 'utf8'))
const universities = JSON.parse(readFileSync(join(DATA, 'universities-index.json'), 'utf8'))
  .filter((u) => !mapping[u.sourceKey])

const decode = (s) => s.replace(/&#0?39;|&apos;/g, "'").replace(/[’‘]/gu, "'").replace(/＆|&amp;/gu, "&")
const norm = (s) => decode(s).toLowerCase().replace(/universtiy/g, 'university').replace(/\(.*?\)/g, '')
  .replace(/^the\s+/, '').replace(/[^a-z0-9]+/g, ' ').trim()

async function wd(params) {
  for (let attempt = 0; attempt < 4; attempt++) {
    const res = await fetch(`https://www.wikidata.org/w/api.php?${new URLSearchParams({ format: 'json', ...params })}`, { headers: { 'User-Agent': UA } })
    if (res.ok) return res.json()
    await sleep(2000 * (attempt + 1))
  }
  throw new Error('Wikidata unavailable')
}

// Fallback: first suitable photo in the entity's Commons category (P373)
const inJapanCheck = (claims) => (claims.P17 || []).some((c) => c.mainsnak.datavalue?.value?.id === "Q17")
const SKIP = /logo|seal|emblem|symbol|map|crest|flag|mark|sign|\.svg$|\.pdf$|\.tif/i
async function categoryImage(category) {
  if (!category) return null
  const params = new URLSearchParams({ action: "query", format: "json", list: "categorymembers", cmtitle: `Category:${category}`, cmtype: "file", cmlimit: "50" })
  const res = await fetch(`https://commons.wikimedia.org/w/api.php?${params}`, { headers: { "User-Agent": UA } })
  if (!res.ok) return null
  const files = ((await res.json()).query?.categorymembers || []).map((m) => m.title.replace(/^File:/, ""))
  return files.find((f) => /\.(jpe?g|png)$/i.test(f) && !SKIP.test(f)) ?? null
}

const candidates = {}
let i = 0
for (const u of universities) {
  i++
  const query = decode(u.name).replace(/universtiy/gi, 'University').replace(/\s*\(.*?\)\s*/g, ' ').trim()
  const search = await wd({ action: 'wbsearchentities', search: query, language: 'en', type: 'item', limit: '7' })
  const ids = (search.search || []).filter((r) => norm(r.match?.text || r.label || '') === norm(query)).map((r) => r.id)
  if (ids.length) {
    const ent = await wd({ action: 'wbgetentities', ids: ids.join('|'), props: 'claims' })
    for (const id of ids) {
      const claims = ent.entities[id]?.claims || {}
      const inJapan = (claims.P17 || []).some((c) => c.mainsnak.datavalue?.value?.id === 'Q17')
      const image = claims.P18?.[0]?.mainsnak.datavalue?.value
        ?? (inJapanCheck(claims) ? await categoryImage(claims.P373?.[0]?.mainsnak.datavalue?.value) : null)
      if (inJapan && image) {
        candidates[u.sourceKey] = {
          sourceUrl: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(image.replace(/ /g, '_'))}`,
          altText: `${u.name} campus`,
          wikidata: id,
        }
        break
      }
    }
  }
  if (i % 25 === 0) console.log(`${i}/${universities.length}, found ${Object.keys(candidates).length}`)
  await sleep(300)
}

writeFileSync(out, JSON.stringify(candidates, null, 2) + '\n')
console.log(`Found ${Object.keys(candidates).length} candidates for ${universities.length} universities without photos`)
