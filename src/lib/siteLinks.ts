import { getBrand } from './branding'

/* Where "website" and "download" in the UI point. The instance sets them via
   BRAND_WEBSITE_URL / BRAND_DOWNLOAD_URL; the fallbacks are Doop's own pages,
   because a self-hosted server has no marketing site of its own and the
   desktop installers are the same whichever server they connect to. */
export const DOWNLOAD_URL = (): string => getBrand().downloadUrl
export const WEBSITE_URL = (): string => getBrand().websiteUrl
