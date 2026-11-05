import * as React from 'react'

import { cn } from '@/lib/utils'
import { useBrand } from '@/lib/branding'
import { useTheme } from '@/lib/theme'
import { Logo } from '../Logo'

/** Logo + name, the lockup used in headers, the auth card and the footer.
 *  With a BRAND_LOGO_URL configured the wordmark image replaces both the
 *  mark and the text (the instance's own art carries its name); its dark-
 *  surface variant is swapped in when the theme resolves dark. Without one
 *  this is the built-in Disc-D tile plus the app name. */
function Wordmark({
  size = 'md',
  className,
  children,
  ...props
}: React.ComponentProps<'span'> & { size?: 'sm' | 'md' }) {
  const brand = useBrand()
  const { resolved } = useTheme()
  const logo = resolved === 'dark' ? brand.logoUrl : (brand.logoUrlDark ?? brand.logoUrl)
  return (
    <span
      data-slot="wordmark"
      className={cn(
        'flex items-center gap-3 font-display font-extrabold tracking-[-0.01em]',
        size === 'sm' ? 'gap-2 text-lead/4.5' : 'text-heading/5.5',
        className,
      )}
      {...props}
    >
      {logo ? (
        <img
          src={logo}
          alt=""
          className={
            size === 'sm'
              ? 'h-[22px] w-auto max-w-[160px] object-contain'
              : 'h-[26px] w-auto max-w-[200px] object-contain'
          }
        />
      ) : (
        <Logo className={size === 'sm' ? 'size-[26px]' : 'size-[30px]'} />
      )}
      {logo ? null : (children ?? brand.name)}
    </span>
  )
}

export { Wordmark }
