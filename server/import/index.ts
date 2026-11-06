/**
 * Import pipeline public API.
 *
 * Usage:
 *
 *   import { registerSource, importOne } from './import/index'
 *
 *   // Register a source (once at boot):
 *   registerSource('github', githubSource)
 *   registerSource('upload', uploadSource)
 *   registerSource('url', urlSource)
 *
 *   // Import a design (per file):
 *   const result = await importOne(
 *     { source: sourceInstance, hostedImages, inlinedFonts },
 *     { path: 'pages/home/02-hero.html', branch: 'main' },
 *   )
 *   // result.html, result.width, result.height
 */

export type { ImportedDesign, AcquireParams, CompiledFrame, TransformContext, DesignSource, HostedAsset } from './types'
export { registerSource, acquireFrom } from './types'
export { transformDesign, detectDimensions, extractTitle } from './transform'
export { importOne } from './pipeline'
export { createGithubSource, createUploadSource } from './sources'
