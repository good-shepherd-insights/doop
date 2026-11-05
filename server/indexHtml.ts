import { createHash } from 'node:crypto'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import { env } from './env.ts'
import { brandDescription, brandName, brandTagline } from './branding.ts'

/**
 * Branding applied to the built client's index.html at serve time, so one
 * image can carry any brand without a rebuild: tokens in index.html are
 * replaced with the APP_NAME/BRAND_* values and an optional `--brand` color
 * override is injected before the theme pre-paint script (no flash on
 * reload). Hashed assets under /assets/ are served untouched.
 *
 * Values are inserted verbatim — they are operator-provided (env), not user
 * input. Re-read per request instead of cached: the file is small, the
 * catch-all is a cold path, and the env.ts contract lets tests flip a
 * variable at runtime.
 */

const BRAND_CSS_ANCHOR = '<meta name="color-scheme" content="light dark" />'

function brandColorStyle(): string {
  const light = env.BRAND_COLOR
  const dark = env.BRAND_COLOR_DARK
  if (!light && !dark) return ''
  const rules = [light ? `:root{--brand:${light}}` : '', dark ? `.dark{--brand:${dark}}` : ''].filter(Boolean)
  return `<style id="brand-colors">${rules.join('')}</style>`
}

export function brandedIndexHtml(): string {
  const raw = readFileSync(path.join(process.cwd(), 'dist', 'index.html'), 'utf8')
  const title = `${brandName()} — ${brandTagline()}`
  const style = brandColorStyle()
  return raw
    .replaceAll('{{BRAND_NAME}}', brandName())
    .replaceAll('{{BRAND_TAGLINE}}', brandTagline())
    .replaceAll('{{BRAND_TITLE}}', title)
    .replaceAll('{{BRAND_DESCRIPTION}}', brandDescription())
    .replaceAll(BRAND_CSS_ANCHOR, `${BRAND_CSS_ANCHOR}${style}`)
}

/** Identifies the client bundle this process serves. Hashing the branded
 *  index.html works because Vite writes hashed asset names into it — any
 *  frontend change changes the hash, while server-only deploys and plain
 *  restarts do not. Clients compare it across reconnects to know their
 *  loaded bundle is stale. */
export function buildId(): string {
  try {
    return createHash('sha1').update(brandedIndexHtml()).digest('hex').slice(0, 12)
  } catch {
    return 'dev'
  }
}
