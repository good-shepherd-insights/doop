/**
 * Upstream Doop's own brand, in exactly one place. Both sides read it:
 * server/env.ts seeds its env defaults from here and src/lib/branding.ts uses
 * it as the pre-fetch/failure fallback, so an instance that sets no branding
 * variables looks exactly like upstream — and a rebrand of upstream happens
 * by editing this object alone.
 */
export const DEFAULT_BRANDING = {
  name: 'Doop',
  tagline: 'designed by Agents & Humans',
  description:
    'A multiplayer design canvas where people and AI agents create side by side. Connect any MCP agent and watch it design live.',
  agentName: 'Doop',
  logoUrl: null,
  logoUrlDark: null,
  markUrl: null,
  markUrlDark: null,
  websiteUrl: 'https://doop.design',
  downloadUrl: 'https://doop.design/download',
  emailPasswordAuth: true,
}
