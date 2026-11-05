import { cn } from '@/lib/utils'
import { useBrand } from '@/lib/branding'
import { useTheme } from '@/lib/theme'
import { DoopMark } from './Logo'

/** The resident agent's mark. With BRAND_MARK_URL set this is the instance's
 *  own logo (theme-picked, sized in px); without one it falls back to the
 *  built-in Disc-D glyph, so upstream keeps its identity. */
export function AgentMark({ size = 13, color, className }: { size?: number; color?: string; className?: string }) {
  const { markUrl, markUrlDark } = useBrand()
  const { resolved } = useTheme()
  const url = resolved === 'dark' ? markUrl : (markUrlDark ?? markUrl)
  if (!url) return <DoopMark size={size} color={color} className={className} />
  return (
    <img
      src={url}
      alt=""
      className={cn('inline-block object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}
