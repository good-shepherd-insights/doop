import type { AgentRole } from '../../shared/agents'
import { useBrand } from '@/lib/branding'
import { DoopMark } from './Logo'
import { cn } from '@/lib/utils'

/** A role's badge: a filled circle in the role's crew colour with the white
 *  Disc-D inside — or, when the instance sets a square brand mark, that mark
 *  as the whole badge. `size` is the circle's diameter. An unknown role gets
 *  a neutral ink circle so a stale card still reads. */
export function RoleMark({
  role,
  size = 14,
  className,
  style,
}: {
  role?: Pick<AgentRole, 'color'>
  size?: number
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
