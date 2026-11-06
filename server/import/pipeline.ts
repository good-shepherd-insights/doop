import type { AcquireParams, CompiledFrame, DesignSource, TransformContext } from './types'
import { transformDesign } from './transform'

/**
 * Import pipeline: fetch content from any source, compile it into
 * self-contained frame HTML, and return it ready for placement.
 *
 * Zero branching on file type — every file goes through the same steps:
 *   ACQUIRE (source-specific) → TRANSFORM (deterministic) → RESULT
 *
 * The caller then HOSTS assets (upload images, inline fonts) and
 * PLACES the frame (create_frame with the correct page + position).
 */

export interface PipelineConfig {
  /** The design source to use for fetching content. */
  source: DesignSource
  /** Map of original asset ref → hosted URL. Populated during import. */
  hostedImages: Map<string, string>
  /** Map of original font ref → data-URI. Populated during import. */
  inlinedFonts: Map<string, string>
}

/**
 * Import a single design file.
 * Fetches from the source, transforms, and returns the compiled result.
 */
export async function importOne(config: PipelineConfig, params: AcquireParams): Promise<CompiledFrame> {
  const designs = await config.source.acquire(params)
  if (!designs.length) throw new Error('source returned no designs')
  const design = designs[0]!
  const ctx: TransformContext = { hostedImages: config.hostedImages, inlinedFonts: config.inlinedFonts }
  return transformDesign(design, ctx)
}
