/**
 * Durable HTML import pipeline.
 *
 * Accepts HTML content from any source (GitHub repo, direct upload,
 * website URL, clipboard paste) and produces self-contained frame HTML
 * with real content, correct sizes, and hosted assets.
 *
 * One pipeline, no branching on file type or source.
 * Same TRANSFORM → HOST → PLACE steps regardless of origin.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** The result of acquiring HTML content from any source. */
export interface ImportedDesign {
  /** Raw HTML as acquired; transformDesign makes it frame-ready. */
  html: string
  /** Native width declared by the file ($preview or root <section>). */
  width: number
  /** Native height declared by the file ($preview or root <section>). */
  height: number
  /** Title extracted from `<title>` or filename. */
  title: string
  /** Original source path/URL for provenance tracking. */
  sourcePath: string
}

/** Where the HTML content came from. Each implementation returns ImportedDesign[]. */
export interface DesignSource {
  label: string
  acquire(params: AcquireParams): Promise<ImportedDesign[]>
}

export interface AcquireParams {
  /** For repo sources: the file path within the repo. */
  path?: string
  /** For URL sources: the page URL. */
  url?: string
  /** For upload sources: raw HTML content (already a string). */
  content?: string
  /** For repo sources: branch (defaults to 'main'). */
  branch?: string
}

/** A hosted asset. Images get permanent URLs; fonts get data-URIs. */
export interface HostedAsset {
  originalRef: string
  replacement: string
  kind: 'image' | 'font' | 'other'
}

/** Context passed to transform functions for asset resolution. */
export interface TransformContext {
  hostedImages: Map<string, string>
  inlinedFonts: Map<string, string>
}

export interface CompiledFrame {
  html: string
  width: number
  height: number
}

// ---------------------------------------------------------------------------
// Source registry — register at boot, resolve by key
// ---------------------------------------------------------------------------

const sources = new Map<string, DesignSource>()

export function registerSource(key: string, source: DesignSource): void {
  sources.set(key, source)
}

export async function acquireFrom(key: string, params: AcquireParams): Promise<ImportedDesign[]> {
  const source = sources.get(key)
  if (!source) throw new Error(`unknown import source: ${key}`)
  return source.acquire(params)
}
