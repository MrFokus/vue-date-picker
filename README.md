# 📅 @mrfokus/vue-date-picker-3

Vue 3 компонент выбора даты с поддержкой одиночных дат и диапазонов. Полностью на TypeScript, с возможностью кастомизации через `slot`-ы и переменные CSS.

---

## 🚀 Установка

```bash
npm install @mrfokus/vue-date-picker
```

Или через CLI:

```bash
npx @mrfokus/vue-date-picker
```

---
## Библиотека содержит несколько компонентов

|Компонент| Описание|
|---------|---------|
|`DatePicker.vue`| Базовый дата пикер с возможностью выбора диапазона|
|`DoubleDatePicker.vue`|Обертка для DatePicker. Содержит в себе 2 календаря и имеет такие же входные параметры|

---

## ⚠️ Важно – DoubleDatePicker.vue содержит в себе компонент DatePicker.vue, без него работать не будет. 
## ⚠️ Также проверяйте пути иморта DatePicker в DoubleDatePicker 


## 🧩 Использование

```vue
<script setup lang="ts">
import DatePicker from 'your_path/vue-date-picker-3'
</script>

<template>
  <DatePicker
    v-model="value"
    mode="range" <!-- или "pick" -->
  />
</template>
```

---

## ⚙️ Свойства

| Свойство       | Тип                             | Описание                                 |
|----------------|----------------------------------|-------------------------------------------|
| `v-model`      | `Date \| { start: Date, end: Date }` | Активное значение (выбор даты или диапазона) |
| `mode`         | `'range' | 'pick'`             | Режим выбора: одиночная дата или диапазон |

---

## 🎨 Стилизация

### Кастом компонентов производится через css и заданные классы

Компонент использует CSS-переменные:

```css
--dp-gap: 16px;
--dp-text-color: #191135;
--dp-border-radius: 24px;
--dp-border: 1px solid #E8E7EB;
--dp-background: white;
--dp-primary: #0E1829;
--dp-day-highlight: #F2F4F7;
--dp-other-month-color: #9C99A8;
--dp-days-border-radius: 10px;
```

Ты можешь переопределить их в своём проекте через глобальный CSS.

---

## 🧱 Слоты

Компонент максимально кастомизируем. Все важные элементы вынесены в слоты:

| Слот              |Описание|
|-------------------|----------------------------------------------------|
| `header`          | Обёртка для заголовка                              |
| `prev-button`     | Кнопка "предыдущий месяц"                          |
| `next-button`     | Кнопка "следующий месяц"                           |
| `current-day`     | Текст текущего месяца/года                         |
| `day-week`        | Отображение названий дней недели                   |
| `days`            | Обёртка всех дней                                  |
| `:name="timestamp"` | Слот для отдельной ячейки календаря по `getTime()` |

---


## Разработано с 💛 by [@mrfokuss](https://github.com/mrfokuss)
