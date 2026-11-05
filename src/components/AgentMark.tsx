import { cn } from '@/lib/utils'
import { useBrand } from '@/lib/branding'
import { DoopMark } from './Logo'

/** The resident agent's mark. With BRAND_MARK_URL set this is the instance's
 *  own square mark (as an image, sized in px); without one it falls back to
 *  the built-in Disc-D glyph, so upstream keeps its identity. */
export function AgentMark({ size = 13, color, className }: { size?: number; color?: string; className?: string }) {
  const { markUrl } = useBrand()
  if (!markUrl) return <DoopMark size={size} color={color} className={className} />
  return (
    <img
      src={markUrl}
      alt=""
      className={cn('inline-block object-contain', className)}
      style={{ width: size, height: size }}
    />
  )
}

/** The same choice for RoleMark's colored circle: a brand mark fills the
 *  whole circle (it is a complete logo, not a glyph to sit inside one);
 *  without a brand mark the white Disc-D sits in the role's circle. */
export function AgentMarkTile({
  size = 14,
  role,
  className,
  style,
}: {
  size?: number
  role?: { color: string }
  className?: string
  style?: React.CSSProperties
}) {
  const { markUrl } = useBrand()
  if (markUrl)
    return (
      <img
        src={markUrl}
        alt=""
        className={cn('flex-none rounded-full object-cover align-middle', className)}
        style={{ width: size, height: size, ...style }}
      />
    )
  return (
    <span
      className={cn('inline-grid flex-none place-items-center rounded-full align-middle', className)}
      style={{ width: size, height: size, background: role?.color ?? 'var(--ink-faint)', ...style }}
      aria-hidden
    >
      <DoopMark size={Math.round(size * 0.55)} color="#fff" className="block" />
    </span>
  )
}
