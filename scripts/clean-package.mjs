import { rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

rmSync(fileURLToPath(new URL('../packages/catholic-calendar/dist', import.meta.url)), {
  recursive: true,
  force: true,
})
