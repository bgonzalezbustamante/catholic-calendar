import type { CSSProperties } from 'react'

import bibleIcon from '@/assets/christicons/bible-1.svg'
import { todayInTimeZone } from '@/lib/catholic-calendar'

const TIME_ZONE = 'Europe/Amsterdam'

export default function SiteFooter() {
  const bibleStyle = {
    '--footer-credit-icon': `url("${bibleIcon.src}")`,
  } as CSSProperties
  const year = todayInTimeZone(TIME_ZONE).slice(0, 4)

  return (
    <footer className="site-footer">
      <div className="shell footer-inner">
        <span className="footer-credit">
          <span
            aria-hidden="true"
            className="footer-credit-icon"
            style={bibleStyle}
          />
          <span>
            Display icons by{' '}
            <a
              href="https://christicons.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Christicons
            </a>
            {' · '}
            <a
              href="https://www.flaticon.com/free-icons/rosary"
              target="_blank"
              rel="noopener noreferrer"
            >
              Rosary icons created by Magnific - Flaticon
            </a>
          </span>
        </span>
        <a className="footer-license" href="https://bgonzalezbustamante.com">
          <span>© {year} Dr Bastián González-Bustamante</span>
        </a>
      </div>
    </footer>
  )
}
