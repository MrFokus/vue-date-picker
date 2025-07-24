#!/usr/bin/env node

import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import inquirer from 'inquirer'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const baseDir = path.resolve(__dirname, '../') // корень пакета

async function copyFile(from, to) {
  const src = path.join(baseDir, from)
  const dest = path.resolve(to)

  if (fs.existsSync(src)) {
    await fs.copy(src, dest)
    console.log(`✅ Скопировано: ${from} → ${to}`)
  } else {
    console.warn(`⚠️ Файл "${from}" не найден, пропущено`)
  }
}

async function installDatePicker() {
  const { componentPath } = await inquirer.prompt([
    {
      name: 'componentPath',
      type: 'input',
      message: 'Куда установить компонент DatePicker.vue?',
      default: './components'
    }
  ])

  await copyFile('components/DatePicker.vue', path.join(componentPath, 'DatePicker.vue'))
  return componentPath
}

async function installDoubleDatePicker() {
  const { needDatePicker } = await inquirer.prompt([
    {
      name: 'needDatePicker',
      type: 'confirm',
      message: 'DoubleDatePicker зависит от DatePicker. Установить DatePicker тоже?',
      default: true
    }
  ])
  let componentPath = './components'
  if (needDatePicker) {
    componentPath = await installDatePicker()
  }

  const { doublePath } = await inquirer.prompt([
    {
      name: 'doublePath',
      type: 'input',
      message: 'Куда установить компонент DoubleDatePicker.vue?',
      default: componentPath
    }
  ])

  await copyFile('components/DoubleDatePicker.vue', path.join(doublePath, 'DoubleDatePicker.vue'))
}

async function main() {
  const { component } = await inquirer.prompt([
    {
      name: 'component',
      type: 'list',
      message: 'Что вы хотите установить?',
      choices: ['DatePicker', 'DoubleDatePicker']
    }
  ])

  if (component === 'DatePicker') {
    await installDatePicker()
  } else {
    await installDoubleDatePicker()
  }
}

main()
