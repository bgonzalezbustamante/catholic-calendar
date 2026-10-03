import CalendarIcon from './calendar-icon'
import type { CalendarDisplayItem } from '@/lib/catholic-calendar'

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
            <CalendarIcon icon={item.icon} />
            <span>{item.label}</span>
          </span>
        </span>
      ))}
    </p>
  )
}
