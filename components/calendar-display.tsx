import type { CSSProperties } from 'react'

import angelIcon from '@/assets/christicons/angel.svg'
import calvaryIcon from '@/assets/christicons/calvary.svg'
import candleIcon from '@/assets/christicons/candle.svg'
import chaliceIcon from '@/assets/christicons/chalice.svg'
import easterEggIcon from '@/assets/christicons/easter-egg.svg'
import fireIcon from '@/assets/christicons/fire.svg'
import rosaryIcon from '@/assets/christicons/rosary.svg'
import sacredHeartIcon from '@/assets/christicons/sacred-heart.svg'
import starIcon from '@/assets/christicons/star.svg'
import trinityIcon from '@/assets/christicons/trinity.svg'
import type {
  CalendarDisplayIcon,
  CalendarDisplayItem,
} from '@/lib/catholic-calendar'

const CHRISTICON_SOURCES = {
  angel: angelIcon,
  calvary: calvaryIcon,
  candle: candleIcon,
  chalice: chaliceIcon,
  'easter-egg': easterEggIcon,
  fire: fireIcon,
  rosary: rosaryIcon,
  'sacred-heart': sacredHeartIcon,
  star: starIcon,
  trinity: trinityIcon,
} satisfies Record<CalendarDisplayIcon, { src: string }>

function DisplayIcon({ icon }: { icon: CalendarDisplayIcon }) {
  const source = CHRISTICON_SOURCES[icon]
  const style = {
    '--calendar-display-icon': `url("${source.src}")`,
  } as CSSProperties

  return (
    <span
      aria-hidden="true"
      className="calendar-display-icon"
      data-icon={icon}
      style={style}
    />
  )
}

export default function CalendarDisplay({
  items,
}: {
  items: CalendarDisplayItem[]
}) {
  if (items.length === 0) {
    return <p className="calendar-display">No selected observance or active period</p>
  }

  return (
    <p className="calendar-display">
      {items.map((item, index) => (
        <span className="calendar-display-group" key={item.id}>
          {index > 0 ? (
            <span aria-hidden="true" className="calendar-display-separator">
              ·
            </span>
          ) : null}
          <span className="calendar-display-item">
            {item.icon ? <DisplayIcon icon={item.icon} /> : null}
            <span>{item.label}</span>
          </span>
        </span>
      ))}
    </p>
  )
}
