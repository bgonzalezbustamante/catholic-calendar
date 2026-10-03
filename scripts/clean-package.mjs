import { rmSync } from 'node:fs'

rmSync('packages/catholic-calendar/dist', {
  recursive: true,
  force: true,
})
