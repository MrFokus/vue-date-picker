#!/usr/bin/env node

// cli/init.ts
import path from "path";
import fs from "fs-extra";
import { fileURLToPath } from "url";
import inquirer from "inquirer";
import { execSync } from "child_process";
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var baseDir = path.resolve(__dirname, "../");
async function ensureRekaUIInstalled() {
  const userNodeModules = path.resolve(process.cwd(), "node_modules/reka-ui");
  if (fs.existsSync(userNodeModules)) {
    console.log("\u2705 reka-ui \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
    return;
  }
  console.log("\u26A0\uFE0F  reka-ui \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u0435.");
  const { installReka } = await inquirer.prompt([
    {
      name: "installReka",
      type: "confirm",
      message: "\u0425\u043E\u0442\u0438\u0442\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C reka-ui \u0432 \u0432\u0430\u0448 \u043F\u0440\u043E\u0435\u043A\u0442?",
      default: true
    }
  ]);
  if (installReka) {
    try {
      console.log("\u{1F4E6} \u0423\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u044E reka-ui...");
      execSync("npm install reka-ui@^2.6.0", { stdio: "inherit", cwd: process.cwd() });
      console.log("\u2705 reka-ui \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442!");
    } catch (err) {
      console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435 reka-ui:", err.message);
    }
  } else {
    console.warn("\u26A0\uFE0F reka-ui \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430. \u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u043C\u043E\u0433\u0443\u0442 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E.");
  }
}
async function ensureInternationalizedDateInstalled() {
  const userNodeModules = path.resolve(process.cwd(), "node_modules/@internationalized/date");
  if (fs.existsSync(userNodeModules)) {
    console.log("\u2705 @internationalized/date \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u0435 \u043F\u043E\u043B\u044C\u0437\u043E\u0432\u0430\u0442\u0435\u043B\u044F");
    return;
  }
  console.log("\u26A0\uFE0F  @internationalized/date \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442\u0435.");
  const { instalInternationalized } = await inquirer.prompt([
    {
      name: "instalInternationalized",
      type: "confirm",
      message: "\u0425\u043E\u0442\u0438\u0442\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C @internationalized/date \u0432 \u0432\u0430\u0448 \u043F\u0440\u043E\u0435\u043A\u0442?",
      default: true
    }
  ]);
  if (instalInternationalized) {
    try {
      console.log("\u{1F4E6} \u0423\u0441\u0442\u0430\u043D\u0430\u0432\u043B\u0438\u0432\u0430\u044E @internationalized/date...");
      execSync("npm install @internationalized/date@^2.6.0", { stdio: "inherit", cwd: process.cwd() });
      console.log("\u2705 @internationalized/date \u0443\u0441\u043F\u0435\u0448\u043D\u043E \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430 \u0432 \u043F\u0440\u043E\u0435\u043A\u0442!");
    } catch (err) {
      console.error("\u274C \u041E\u0448\u0438\u0431\u043A\u0430 \u043F\u0440\u0438 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043A\u0435 @internationalized/date:", err.message);
    }
  } else {
    console.warn("\u26A0\uFE0F @internationalized/date \u043D\u0435 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u043B\u0435\u043D\u0430. \u041A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442\u044B \u043C\u043E\u0433\u0443\u0442 \u043D\u0435 \u0440\u0430\u0431\u043E\u0442\u0430\u0442\u044C \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u043E.");
  }
}
async function copyFile(from, to) {
  const src = path.join(baseDir, from);
  const dest = path.resolve(to);
  if (fs.existsSync(src)) {
    await fs.copy(src, dest);
    console.log(`\u2705 \u0421\u043A\u043E\u043F\u0438\u0440\u043E\u0432\u0430\u043D\u043E: ${from} \u2192 ${to}`);
  } else {
    console.warn(`\u26A0\uFE0F \u0424\u0430\u0439\u043B "${from}" \u043D\u0435 \u043D\u0430\u0439\u0434\u0435\u043D, \u043F\u0440\u043E\u043F\u0443\u0449\u0435\u043D\u043E`);
  }
}
async function installDatePicker() {
  const { componentPath } = await inquirer.prompt([
    {
      name: "componentPath",
      type: "input",
      message: "\u041A\u0443\u0434\u0430 \u0443\u0441\u0442\u0430\u043D\u043E\u0432\u0438\u0442\u044C \u043A\u043E\u043C\u043F\u043E\u043D\u0435\u043D\u0442 DatePicker.vue?",
      default: "./components"
    }
  ]);
  await copyFile(
    "components/DatePicker.vue",
    path.join(componentPath, "DatePicker.vue")
  );
  return componentPath;
}
async function main() {
  await ensureRekaUIInstalled();
  await ensureInternationalizedDateInstalled();
  await installDatePicker();
}
main();
