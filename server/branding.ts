import { env } from './env.ts'

/**
 * Whitelabel brand, resolved from environment variables once per read so
 * tests can flip a variable at runtime. Every fallback is Doop's own brand,
 * so an instance that sets nothing looks exactly like upstream.
 *
 * The client receives the user-facing subset through GET /api/branding; the
 * server additionally uses the name/slug for emails, MCP metadata and the
 * index.html transform (see server/index.ts).
 */

export type Branding = {
  /** Display name, e.g. "Vision School Designs". */
  name: string
  /** Slogan shown after the name in the page title. */
  tagline: string
  /** Meta/OG product description. */
  description: string
  /** Resident agent's display name (role id stays `doop`). */
  agentName: string
  /** Wordmark for dark surfaces; null = built-in mark. */
  logoUrl: string | null
  /** Wordmark for light surfaces; falls back to `logoUrl`. */
  logoUrlDark: string | null
  /** Square mark replacing the built-in glyph; null = built-in Disc-D. */
  markUrl: string | null
  /** Marketing site; null = doop.design (upstream default). */
  websiteUrl: string | null
  /** Desktop download page; null = upstream default. */
  downloadUrl: string | null
  /** False = email/password sign-in is disabled and hidden. */
  emailPasswordAuth: boolean
}

export const brandName = () => env.APP_NAME
export const brandTagline = () => env.BRAND_TAGLINE
export const brandDescription = () => env.BRAND_DESCRIPTION
export const brandAgentName = () => env.BRAND_AGENT_NAME ?? env.APP_NAME

export const brandLogoUrl = () => env.BRAND_LOGO_URL
export const brandLogoUrlDark = () => env.BRAND_LOGO_URL_DARK ?? env.BRAND_LOGO_URL
export const brandMarkUrl = () => env.BRAND_MARK_URL

export const brandWebsiteUrl = () => env.BRAND_WEBSITE_URL ?? 'https://doop.design'
export const brandDownloadUrl = () => env.BRAND_DOWNLOAD_URL ?? 'https://doop.design/download'

export const emailPasswordAuth = () => env.EMAIL_PASSWORD_AUTH

/** URL/identifier-safe form of the name, for MCP server names, realms and
 *  filename fallbacks: "Vision School Designs" → "vision-school-designs". */
export function brandSlug(): string {
  const slug = brandName()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'doop'
}

/** The subset the signed-out login screen and the app shell need. Public by
 *  design (it brands the login page); nothing here is a secret. Cached
 *  briefly so an env change propagates without pinning every client. */
export function publicBranding(): Branding {
  return {
    name: brandName(),
    tagline: brandTagline(),
    description: brandDescription(),
    agentName: brandAgentName(),
    logoUrl: env.BRAND_LOGO_URL ?? null,
    logoUrlDark: brandLogoUrlDark() ?? null,
    markUrl: brandMarkUrl() ?? null,
    websiteUrl: brandWebsiteUrl(),
    downloadUrl: brandDownloadUrl(),
    emailPasswordAuth: emailPasswordAuth(),
  }
}
