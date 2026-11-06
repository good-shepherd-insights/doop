import { detectDimensions, extractTitle } from './transform'
import type { AcquireParams, DesignSource, ImportedDesign } from './types'

function toDesign(html: string, sourcePath: string, fallbackTitle: string): ImportedDesign {
  const { width, height } = detectDimensions(html, sourcePath)
  return { html, width, height, title: extractTitle(html) ?? fallbackTitle, sourcePath }
}

function titleFromPath(path: string): string {
  const name = path.split('/').pop() ?? path
  return name
    .replace(/(\.dc)?\.html?$/i, '')
    .replace(/[-_]/g, ' ')
    .trim()
}

/** GitHub repo source: one file per call via the Contents API. */
export function createGithubSource(repo: string, getToken: () => string): DesignSource {
  return {
    label: 'GitHub Repository',
    async acquire(params: AcquireParams): Promise<ImportedDesign[]> {
      if (!params.path) throw new Error('path required for github source')
      const path = params.path.split('/').map(encodeURIComponent).join('/')
      const ref = encodeURIComponent(params.branch ?? 'main')
      const res = await fetch(`https://api.github.com/repos/${repo}/contents/${path}?ref=${ref}`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          Accept: 'application/vnd.github.raw+json',
          'User-Agent': 'vs-import',
        },
      })
      if (!res.ok) throw new Error(`GitHub API ${res.status} for ${params.path}`)
      return [toDesign(await res.text(), params.path, titleFromPath(params.path))]
    },
  }
}

/** Direct upload source: file upload, drag-drop, or paste — content is already a string. */
export function createUploadSource(): DesignSource {
  return {
    label: 'HTML File Upload',
    async acquire(params: AcquireParams): Promise<ImportedDesign[]> {
      if (!params.content) throw new Error('content required for upload source')
      const name = params.path ?? 'upload'
      return [toDesign(params.content, name, titleFromPath(name))]
    },
  }
}
