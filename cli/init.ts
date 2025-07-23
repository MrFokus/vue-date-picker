#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const { target } = await inquirer.prompt([
    {
      name: 'target',
      type: 'input',
      message: 'Куда скопировать компонент DatePicker.vue?',
      default: './components'
    }
  ])

  const baseDir = path.resolve(__dirname, '../')

  const pathsToCopy = [
    { from: 'components/DatePicker.vue', to: path.join(target +'/DatePicker.vue') },
  ]

  for (const { from, to } of pathsToCopy) {
    const src = path.join(baseDir, from)
    const dest = path.resolve(to)

    if (fs.existsSync(src)) {
      await fs.copy(src, dest)
      console.log(`✅ Скопировано: ${from} → ${to}`)
    } else {
      console.warn(`⚠️ Папка "${from}" не найдена, пропущено`)
    }
  }
}

main()
