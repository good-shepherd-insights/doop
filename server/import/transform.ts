import type { CompiledFrame, ImportedDesign, TransformContext } from './types'

/**
 * Transform raw HTML from any source into a self-contained frame document.
 *
 * - Strips every <script> (frames never run imported code).
 * - Unwraps x-dc components: <helmet> children move into <head>, the
 *   <x-dc> wrapper is dropped, body content is kept as-is.
 * - Rewrites repo-relative asset refs via the caller's hosted/inlined maps.
 * - Rewrites same-site links to "#".
 *
 * Pure: no I/O, no store access. Throws instead of emitting a frame that
 * would render wrong (unresolved template bindings).
 */
export function transformDesign(design: ImportedDesign, ctx: TransformContext): CompiledFrame {
  let html = design.html.replace(/<script[\s\S]*?<\/script>/gi, '')

  const helmet = html.match(/<helmet>([\s\S]*?)<\/helmet>/i)
  if (helmet) {
    html = html.replace(helmet[0], '')
    html = /<\/head>/i.test(html)
      ? html.replace(/<\/head>/i, `${helmet[1] ?? ''}\n</head>`)
      : `<head>${helmet[1] ?? ''}</head>${html}`
  }
  html = html.replace(/<\/?x-dc[^>]*>/gi, '')

  for (const [originalRef, hostedUrl] of ctx.hostedImages) html = html.replaceAll(originalRef, hostedUrl)
  for (const [originalRef, dataUri] of ctx.inlinedFonts) html = html.replaceAll(originalRef, dataUri)

  html = html.replace(/href="\/(?!\/)[^"]*"/g, 'href="#"')

  // Data-driven components need their script to render; without it the
  // bindings would show as raw text. Refuse rather than ship that.
  const binding = html.match(/\{\{[^}]+\}\}|<sc-(?:for|if)[\s>]/)
  if (binding) throw new Error(`${design.sourcePath}: unresolved template binding ${binding[0]}`)

  if (!/<!doctype/i.test(html)) html = `<!doctype html>\n${html}`

  return { html, width: design.width, height: design.height }
}

/**
 * The file's own declared artboard size. Order: x-dc `$preview`, then a
 * root <section> with explicit px width and height. Never a default:
 * throws when the file declares no size, so the caller measures instead.
 */
export function detectDimensions(html: string, sourcePath: string): { width: number; height: number } {
  const preview = html.match(/"\$preview"\s*:\s*\{\s*"width"\s*:\s*(\d+)\s*,\s*"height"\s*:\s*(\d+)/)
  if (preview?.[1] && preview[2]) return { width: Number(preview[1]), height: Number(preview[2]) }

  const style = html.match(/<section[^>]*style="([^"]*)"/)?.[1] ?? ''
  const width = style.match(/(?:^|;)\s*width:\s*(\d+)px/)?.[1]
  const height = style.match(/(?:^|;)\s*height:\s*(\d+)px/)?.[1]
  if (width && height) return { width: Number(width), height: Number(height) }

  throw new Error(`${sourcePath}: no declared size ($preview or <section> width/height); measure it`)
}

export function extractTitle(html: string): string | null {
  return html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim() ?? null
}
