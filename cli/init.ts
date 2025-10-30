#!/usr/bin/env node

import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { execSync } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseDir = path.resolve(__dirname, "../"); // корень пакета

async function ensureRekaUIInstalled() {
  const userNodeModules = path.resolve(process.cwd(), 'node_modules/reka-ui')

  if (fs.existsSync(userNodeModules)) {
    console.log('✅ reka-ui найдена в проекте пользователя')
    return
  }

  console.log('⚠️  reka-ui не найдена в проекте.')

  const { installReka } = await inquirer.prompt([
    {
      name: 'installReka',
      type: 'confirm',
      message: 'Хотите установить reka-ui в ваш проект?',
      default: true
    }
  ])

  if (installReka) {
    try {
      console.log('📦 Устанавливаю reka-ui...')
      execSync('npm install reka-ui@^2.6.0', { stdio: 'inherit', cwd: process.cwd() })
      console.log('✅ reka-ui успешно установлена в проект!')
    } catch (err) {
      console.error('❌ Ошибка при установке reka-ui:', err.message)
    }
  } else {
    console.warn('⚠️ reka-ui не установлена. Компоненты могут не работать корректно.')
  }
}

async function copyFile(from, to) {
  const src = path.join(baseDir, from);
  const dest = path.resolve(to);

  if (fs.existsSync(src)) {
    await fs.copy(src, dest);
    console.log(`✅ Скопировано: ${from} → ${to}`);
  } else {
    console.warn(`⚠️ Файл "${from}" не найден, пропущено`);
  }
}

async function installDatePicker() {
  const { componentPath } = await inquirer.prompt([
    {
      name: "componentPath",
      type: "input",
      message: "Куда установить компонент DatePicker.vue?",
      default: "./components",
    },
  ]);

  await copyFile(
    "components/DatePicker.vue",
    path.join(componentPath, "DatePicker.vue")
  );
  return componentPath;
}

async function main() {
  await ensureRekaUIInstalled();
  await installDatePicker();
}

main();
