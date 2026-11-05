import { useSyncExternalStore } from 'react'
import { addRoleAlias, DEFAULT_ROLE_ID } from '../../shared/agents'

/**
 * The instance's brand, read once from GET /api/branding (server/branding.ts)
 * before the first render, the same way the locale is. Until it answers — or
 * if the endpoint is unreachable — the fallback keeps upstream Doop branding,
 * so a failed fetch degrades to the default, never to a blank.
 */

export type Branding = {
  /** Display name, e.g. "Vision School Designs". */
  name: string
  tagline: string
  description: string
  /** Resident agent's display name (role id stays `doop`). */
  agentName: string
  /** Wordmark for dark surfaces; null = built-in mark. */
  logoUrl: string | null
  /** Wordmark for light surfaces; falls back to `logoUrl`. */
  logoUrlDark: string | null
  /** Square mark replacing the built-in Disc-D glyph; null = built-in. */
  markUrl: string | null
  /** Mark for light surfaces; falls back to `markUrl`. */
  markUrlDark: string | null
  websiteUrl: string
  downloadUrl: string
  /** False = email/password sign-in is disabled server-side; the login
   *  screen shows only SSO providers. */
  emailPasswordAuth: boolean
}

const FALLBACK: Branding = {
  name: 'Doop',
  tagline: 'designed by Agents & Humans',
  description: '',
  agentName: 'Doop',
  logoUrl: null,
  logoUrlDark: null,
  markUrl: null,
  markUrlDark: null,
  websiteUrl: 'https://doop.design',
  downloadUrl: 'https://doop.design/download',
  emailPasswordAuth: true,
}

let current: Branding = FALLBACK
const listeners = new Set<() => void>()
let started = false

export function initBranding(): Promise<void> {
  if (started) return Promise.resolve()
  started = true
  return fetch('/api/branding')
    .then(async (res) => {
      if (!res.ok) throw new Error(`branding ${res.status}`)
      current = { ...FALLBACK, ...(await res.json()) }
      /* "@Designer" mentions resolve to the resident role on this side too */
      addRoleAlias(current.agentName, DEFAULT_ROLE_ID)
      for (const listener of listeners) listener()
    })
    .catch(() => {
      /* offline or older server: keep the fallback brand */
    })
}

export const getBrand = (): Branding => current

function subscribe(listener: () => void): () => void {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useBrand(): Branding {
  return useSyncExternalStore(subscribe, getBrand)
}

/** Values the i18n engine injects for `{brand}` / `{brandAgent}` so catalog
 *  strings can carry the name without every t() call passing it. */
export function brandVars(): Record<string, string> {
  return { brand: current.name, brandAgent: current.agentName }
}
