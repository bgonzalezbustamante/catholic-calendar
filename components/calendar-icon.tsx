import type { CSSProperties } from 'react'

import angelIcon from '@/assets/christicons/angel.svg'
import breadIcon from '@/assets/christicons/bread.svg'
import calvaryIcon from '@/assets/christicons/calvary.svg'
import candleIcon from '@/assets/christicons/candle.svg'
import chaliceIcon from '@/assets/christicons/chalice.svg'
import churchIcon from '@/assets/christicons/church-1.svg'
import crossIcon from '@/assets/christicons/cross.svg'
import doveIcon from '@/assets/christicons/dove.svg'
import easterEggIcon from '@/assets/christicons/easter-egg.svg'
import fireIcon from '@/assets/christicons/fire.svg'
import rosaryIcon from '@/assets/christicons/rosary.svg'
import sacredHeartIcon from '@/assets/christicons/sacred-heart.svg'
import stPeterIcon from '@/assets/christicons/st-peter.svg'
import starIcon from '@/assets/christicons/star.svg'
import tombstoneIcon from '@/assets/christicons/tombstone.svg'
import trinityIcon from '@/assets/christicons/trinity.svg'
import type { CalendarDisplayIcon } from '@/lib/catholic-calendar'

const CHRISTICON_SOURCES = {
  angel: angelIcon,
  bread: breadIcon,
  calvary: calvaryIcon,
  candle: candleIcon,
  chalice: chaliceIcon,
  'church-1': churchIcon,
  cross: crossIcon,
  dove: doveIcon,
  'easter-egg': easterEggIcon,
  fire: fireIcon,
  rosary: rosaryIcon,
  'sacred-heart': sacredHeartIcon,
  'st-peter': stPeterIcon,
  star: starIcon,
  tombstone: tombstoneIcon,
  trinity: trinityIcon,
} satisfies Record<CalendarDisplayIcon, { src: string }>

export default function CalendarIcon({
  icon,
  className = '',
}: {
  icon: CalendarDisplayIcon
  className?: string
}) {
  const source = CHRISTICON_SOURCES[icon]
  const style = {
    '--calendar-display-icon': `url("${source.src}")`,
  } as CSSProperties

  return (
    <span
      aria-hidden="true"
      className={`calendar-display-icon ${className}`.trim()}
      data-icon={icon}
      style={style}
    />
  )
}
