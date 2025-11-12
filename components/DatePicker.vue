<script setup lang="ts">
import { CalendarDate, type DateValue } from '@internationalized/date'
import {
  CalendarCell,
  CalendarCellTrigger,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHead,
  CalendarGridRow,
  CalendarHeadCell,
  CalendarHeader,
  CalendarNext,
  CalendarPrev,
  CalendarRoot,
  type CalendarRootProps
} from 'reka-ui'
import { ref, watch } from 'vue'

const ruMonths = [
  'январь',
  'февраль',
  'март',
  'апрель',
  'май',
  'июнь',
  'июль',
  'август',
  'сентябрь',
  'октябрь',
  'ноябрь',
  'декабрь'
]
type IPropsDatePickerValue = Date | Date[] | null

const props = withDefaults(
  defineProps<
    Omit<CalendarRootProps, 'modelValue' | 'placeholder'> & {
      modelValue: IPropsDatePickerValue
    }
  >(),
  {
    modelValue: null,
    numberOfMonths: 1
  }
)
const emit = defineEmits<{
  'update:modelValue': [IPropsDatePickerValue]
}>()

const localModelValue = ref<CalendarRootProps['modelValue']>()

watch(
  () => props.modelValue,
  (value) => {
    if (value) {
      console.log(value)

      if (Array.isArray(value))
        localModelValue.value = value.map((item: Date) => toCalendarDate(item))
      else localModelValue.value = toCalendarDate(value)
    }
  },
  { immediate: true, deep: true }
)

function changeDate(value: CalendarRootProps['modelValue']) {
  if (value)
    emit(
      'update:modelValue',
      Array.isArray(value)
        ? value.map(
            (item: DateValue) => new Date(item.year, item.month - 1, item.day)
          )
        : new Date(value.year, value.month - 1, value.day)
    )
}

function toCalendarDate(date: Date) {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  )
}
</script>

<template>
  <CalendarRoot
    ref="calendarRef"
    v-bind="props"
    v-slot="{ weekDays, grid }"
    :number-of-months="props.numberOfMonths"
    :locale="'ru'"
    :weekday-format="'short'"
    class="mrfokus-dp-Calendar"
    :model-value="localModelValue"
    :disable-days-outside-current-view="true"
    :prevent-deselect="true"
    @update:model-value="changeDate"
  >
    <CalendarHeader class="mrfokus-dp-CalendarHeaderNavigation">
      <CalendarPrev class="mrfokus-dp-CalendarNavButton">
        <slot name="prev-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="#667085"
              style="
                stroke: #667085;
                stroke: color(display-p3 0.4009 0.4408 0.5207);
                stroke-opacity: 1;
              "
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </CalendarPrev>
      <CalendarNext class="mrfokus-dp-CalendarNavButton">
        <slot name="next-icon">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
          >
            <path
              d="M7.5 15L12.5 10L7.5 5"
              stroke="#667085"
              style="
                stroke: #667085;
                stroke: color(display-p3 0.4009 0.4408 0.5207);
                stroke-opacity: 1;
              "
              stroke-width="1.66667"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </slot>
      </CalendarNext>
    </CalendarHeader>
    <Transition name="fade" mode="out-in">
      <div
        :key="grid[0] ? grid[0].value.toString() : ''"
        class="mrfokus-dp-CalendarFadeWrapper"
      >
        <template v-for="month in grid" :key="month.value.toString()">
          <slot name="divider">
            <hr class="mrfokus-dp-CalendarDivider" />
          </slot>
          <div class="mrfokus-dp-CalendarWrapperGrid">
            <CalendarHeader class="mrfokus-dp-CalendarHeader"
              >{{ ruMonths[month.value.month - 1] }}
              {{ month.value.year }}</CalendarHeader
            >
            <CalendarGrid class="mrfokus-dp-CalendarGrid">
              <CalendarGridHead>
                <CalendarGridRow class="mrfokus-dp-CalendarGridRow">
                  <CalendarHeadCell
                    v-for="day in weekDays"
                    :key="day"
                    class="mrfokus-dp-CalendarHeadCell"
                  >
                    {{ day }}
                  </CalendarHeadCell>
                </CalendarGridRow>
              </CalendarGridHead>
              <CalendarGridBody class="mrfokus-dp-grid">
                <CalendarGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="mrfokus-dp-CalendarGridRow"
                >
                  <CalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                    class="mrfokus-dp-CalendarCell"
                  >
                    <CalendarCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="mrfokus-dp-CalendarCellTrigger"
                    >
                      <div class="mrfokus-dp-CalendarDay">
                        {{ weekDate.day }}
                      </div>
                    </CalendarCellTrigger>
                  </CalendarCell>
                </CalendarGridRow>
              </CalendarGridBody>
            </CalendarGrid>
          </div>
        </template>
      </div>
    </Transition>
  </CalendarRoot>
</template>

<style>
/* :root {
  Цвета
  --dp-color-bg: #ffffff;
  --dp-color-text: #0e1829;
  --dp-color-muted: #f2f4f7;
  --dp-color-today-border: #0b182a;
  --dp-color-muted-day:'#96A2B5';
  --dp-color-selected-bg: #0e1829;
  --dp-color-selected-text: #ffffff;
  --color-disabled-day: #f2f4f7;

  //Размеры и отступы
  --dp-radius: 16px;
  --dp-radius-day: 10px;
  --dp-spacing: 20px;
  --dp-cell-size: 32px;
  --dp-nav-btn-padding: 8px;
  --dp-divider-margin-top: 24px;
  --dp-cell-gap: 2px;

  Тени
  --dp-shadow: 0 0 16px -2px rgba(14, 24, 41, 0.12),
    0 12px 16px -4px rgba(14, 24, 41, 0.12);

  Шрифты
  --dp-font-family: "Inter", sans-serif;
  --dp-font-size: 14px;
  --dp-line-height: 20px;
  --dp-font-weight: 400;

  Анимация
  --dp-fade-duration: 0.1s;
  --dp-fade-ease: ease;
  --dp-fade-translate: 10px;
} */
/* --- Общие стили --- */

/* --- Анимация появления --- */
.fade-enter-active,
.fade-leave-active {
  transition:
    opacity var(--dp-fade-duration, 0.1s) var(--dp-fade-ease, ease),
    transform var(--dp-fade-duration, 0.1s) var(--dp-fade-ease, ease);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(var(--dp-fade-translate, 10px));
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

/* --- Основной контейнер календаря --- */
.mrfokus-dp-Calendar * {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
.mrfokus-dp-Calendar {
  position: relative;
  background-color: var(--dp-color-bg, white);
  width: fit-content;
  border-radius: var(--dp-radius, 16px);
  box-shadow: var(
    --dp-shadow,
    0 0 16px -2px rgba(14, 24, 41, 0.12),
    0 12px 16px -4px rgba(14, 24, 41, 0.12)
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: var(--dp-font-family, 'Inter', sans-serif);
  color: var(--dp-color-text, #0e1829);
  text-align: center;
  font-size: var(--dp-font-size, 14px);
  line-height: var(--dp-line-height, 20px);
  padding-bottom: var(--dp-spacing, 20px);
}

/* --- Заголовок календаря --- */
.mrfokus-dp-CalendarHeader {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--dp-spacing, 20px) var(--dp-spacing, 20px) 0
    var(--dp-spacing, 20px);
  text-transform: capitalize;
  height: 56px;
}

.mrfokus-dp-CalendarHeaderNavigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  left: var(--dp-spacing, 20px);
  right: var(--dp-spacing, 20px);
  top: var(--dp-spacing, 20px);
  z-index: 0;
}

.mrfokus-dp-CalendarNavButton {
  background: none;
  outline: none;
  border: none;
  padding: var(--dp-nav-btn-padding, 8px);
  cursor: pointer;
  z-index: 1;
  border-radius: var(--dp-radius-day, 10px);
}
.mrfokus-dp-CalendarNavButton:hover {
  background: var(--dp-color-muted, #f2f4f7);
}

/* --- Таблица дней --- */
.mrfokus-dp-CalendarGrid {
  border-collapse: collapse;
  margin: 0 var(--dp-spacing, 20px);
}

.mrfokus-dp-CalendarDivider {
  display: flex;
  background-color: var(--dp-color-muted, #f2f4f7);
  border: none;
  min-width: 1px;
  height: auto;
  margin-top: var(--dp-divider-margin-top, 24px);
  border-radius: 999px;
}
.mrfokus-dp-CalendarDivider:first-of-type {
  display: none;
}

/* --- Ячейки календаря --- */
.mrfokus-dp-CalendarHeadCell,
.mrfokus-dp-CalendarCellTrigger .mrfokus-dp-CalendarDay {
  text-transform: capitalize;
  font-weight: var(--dp-font-weight, 400);
  width: var(--dp-cell-size, 32px);
  height: var(--dp-cell-size, 32px);
}

.mrfokus-dp-CalendarCellTrigger .mrfokus-dp-CalendarDay {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--dp-radius-day, 10px);
}
.mrfokus-dp-CalendarCellTrigger:hover .mrfokus-dp-CalendarDay {
  background: var(--dp-color-muted, #f2f4f7);
}

.mrfokus-dp-CalendarCellTrigger[data-today] .mrfokus-dp-CalendarDay {
  border-radius: var(--dp-radius-day, 10px);
  border: 1px solid var(--dp-color-today-border, #0b182a);
}

.mrfokus-dp-CalendarCellTrigger[data-selected='true'] .mrfokus-dp-CalendarDay {
  background: var(--dp-color-selected-bg, #0e1829);
  color: var(--dp-color-selected-text, hsl(0, 0%, 100%));
}

.mrfokus-dp-CalendarWrapper {
  display: flex;
}
.mrfokus-dp-CalendarCellTrigger[data-outside-view] {
  display: none;
}
.mrfokus-dp-CalendarFadeWrapper {
  display: flex;
}
.mrfokus-dp-CalendarWrapperHeading {
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  margin: 0 -80px;
  z-index: 0;
}
.mrfokus-dp-CalendarCellTrigger[data-unavailable],
.mrfokus-dp-CalendarCellTrigger[data-unavailable] .mrfokus-dp-CalendarDay {
  cursor: not-allowed;
  color: var(--dp-color-muted-day, #96a2b5);
}
.mrfokus-dp-CalendarWrapperGrid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.mrfokus-dp-CalendarCell:not([data-disabled]) {
  cursor: pointer;
}
.mrfokus-dp-CalendarCell:not(:first-child) .mrfokus-dp-CalendarDay {
  margin-left: 1px;
  margin-right: 1px;
}
</style>
