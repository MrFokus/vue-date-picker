<script setup lang="ts">
import { CalendarDate } from "@internationalized/date";
import {
  RangeCalendarCell,
  RangeCalendarCellTrigger,
  RangeCalendarGrid,
  RangeCalendarGridBody,
  RangeCalendarGridHead,
  RangeCalendarGridRow,
  RangeCalendarHeadCell,
  RangeCalendarHeader,
  RangeCalendarNext,
  RangeCalendarPrev,
  RangeCalendarRoot,
  type RangeCalendarRootProps,
} from "reka-ui";
import { ref, watch } from "vue";

const ruMonths = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

interface IPropsDatePickerValue {
  start: Date | null;
  end: Date | null;
}

const props = withDefaults(
  defineProps<
    Omit<RangeCalendarRootProps, "modelValue" | "placeholder"> & {
      modelValue: IPropsDatePickerValue;
    }
  >(),
  {
    numberOfMonths: 1,
  }
);
const emit = defineEmits<{
  "update:modelValue": [IPropsDatePickerValue];
}>();

const localModelValue = ref<RangeCalendarRootProps["modelValue"]>();

watch(
  () => props.modelValue,
  (value) => {
    if (value)
      localModelValue.value = {
        start: value.start?.getTime() ? toCalendarDate(value.start) : undefined,
        end: value.end?.getTime() ? toCalendarDate(value.end) : undefined,
      };
  },
  { immediate: true, deep: true }
);

function changeDate(value: RangeCalendarRootProps["modelValue"]) {
  if (value)
    emit("update:modelValue", {
      start: value.start ? new Date(value.start.toString()) : null,
      end: value.end ? new Date(value.end.toString()) : null,
    });
}

function toCalendarDate(date: Date) {
  return new CalendarDate(
    date.getFullYear(),
    date.getMonth() + 1,
    date.getDate()
  );
}
</script>

<template>
  <RangeCalendarRoot
    ref="calendarRef"
    :number-of-months="props.numberOfMonths"
    v-slot="{ weekDays, grid }"
    :locale="'ru'"
    :weekday-format="'short'"
    class="mrfokus-dp-Calendar"
    :allowNonContiguousRanges="true"
    :model-value="localModelValue"
    @update:model-value="changeDate"
    :disableDaysOutsideCurrentView="true"
    :preventDeselect="true"
  >
    <RangeCalendarHeader class="mrfokus-dp-CalendarHeaderNavigation">
      <RangeCalendarPrev class="mrfokus-dp-CalendarNavButton">
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
      </RangeCalendarPrev>
      <RangeCalendarNext class="mrfokus-dp-CalendarNavButton">
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
      </RangeCalendarNext>
    </RangeCalendarHeader>
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
            <RangeCalendarHeader class="mrfokus-dp-CalendarHeader"
              >{{ ruMonths[month.value.month - 1] }}
              {{ month.value.year }}</RangeCalendarHeader
            >
            <RangeCalendarGrid class="mrfokus-dp-CalendarGrid">
              <RangeCalendarGridHead>
                <RangeCalendarGridRow class="mrfokus-dp-CalendarGridRow">
                  <RangeCalendarHeadCell
                    v-for="(day) in weekDays"
                    :key="day"
                    class="mrfokus-dp-CalendarHeadCell"
                  >
                    {{ day }}
                  </RangeCalendarHeadCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridHead>
              <RangeCalendarGridBody class="mrfokus-dp-grid">
                <RangeCalendarGridRow
                  v-for="(weekDates, index) in month.rows"
                  :key="`weekDate-${index}`"
                  class="mrfokus-dp-CalendarGridRow"
                >
                  <RangeCalendarCell
                    v-for="weekDate in weekDates"
                    :key="weekDate.toString()"
                    :date="weekDate"
                    class="mrfokus-dp-CalendarCell"
                  >
                    <RangeCalendarCellTrigger
                      :day="weekDate"
                      :month="month.value"
                      class="mrfokus-dp-CalendarCellTrigger"
                    >
                      <div class="mrfokus-dp-CalendarDay">
                        {{ weekDate.day }}
                      </div>
                    </RangeCalendarCellTrigger>
                  </RangeCalendarCell>
                </RangeCalendarGridRow>
              </RangeCalendarGridBody>
            </RangeCalendarGrid>
          </div>
        </template>
      </div>
    </Transition>
  </RangeCalendarRoot>
</template>

<style>
/* :root {
  Цвета 
  --dp-color-bg: #ffffff;
  --dp-color-text: #0e1829;
  --dp-color-muted: #f2f4f7;
  --dp-color-today-border: #0b182a;
  --dp-color-selected-bg: #0e1829;
  --dp-color-selected-text: #ffffff;

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
* {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
 
/* --- Анимация появления --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--dp-fade-duration, 0.1s) var(--dp-fade-ease, ease),
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
  font-family: var(--dp-font-family, "Inter", sans-serif);
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
  margin-top: var(--dp-divider-margin-top, 24px);
  border-radius: 999px;
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

/* --- Состояния выделения --- */
.mrfokus-dp-CalendarCellTrigger[data-highlighted],
.mrfokus-dp-CalendarCellTrigger[data-selected="true"] {
  background: var(--dp-color-muted, #f2f4f7);
}

.mrfokus-dp-CalendarCellTrigger[data-today] .mrfokus-dp-CalendarDay {
  border-radius: var(--dp-radius-day, 10px);
  border: 1px solid var(--dp-color-today-border, #0b182a);
}

.mrfokus-dp-CalendarCellTrigger[data-selection-start="true"]
  .mrfokus-dp-CalendarDay,
.mrfokus-dp-CalendarCellTrigger[data-selection-end="true"]
  .mrfokus-dp-CalendarDay,
.mrfokus-dp-Calendar:has(.mrfokus-dp-CalendarCellTrigger[data-selected])
  .mrfokus-dp-CalendarCellTrigger[data-highlighted-end="true"]
  .mrfokus-dp-CalendarDay,
.mrfokus-dp-Calendar:has(.mrfokus-dp-CalendarCellTrigger[data-selected])
  .mrfokus-dp-CalendarCellTrigger[data-highlighted-start="true"]
  .mrfokus-dp-CalendarDay {
  background: var(--dp-color-selected-bg, #0e1829);
  color: var(--dp-color-selected-text, #ffffff);
}

/* --- Радиусы начала и конца диапазона --- */
.mrfokus-dp-CalendarCellTrigger[data-highlighted-start="true"],
.mrfokus-dp-CalendarCellTrigger[data-selection-start="true"],
.mrfokus-dp-CalendarCell:first-of-type
  .mrfokus-dp-CalendarCellTrigger[data-highlighted],
.mrfokus-dp-CalendarCell:first-of-type
  .mrfokus-dp-CalendarCellTrigger[data-selected="true"] {
  border-top-left-radius: var(--dp-radius-day, 10px);
  border-bottom-left-radius: var(--dp-radius-day, 10px);
}

.mrfokus-dp-CalendarCellTrigger[data-highlighted-end="true"],
.mrfokus-dp-CalendarCellTrigger[data-selection-end="true"],
.mrfokus-dp-CalendarCell:last-of-type
  .mrfokus-dp-CalendarCellTrigger[data-highlighted],
.mrfokus-dp-CalendarCell:last-of-type
  .mrfokus-dp-CalendarCellTrigger[data-selected="true"] {
  border-top-right-radius: var(--dp-radius-day, 10px);
  border-bottom-right-radius: var(--dp-radius-day, 10px);
}

.mrfokus-dp-CalendarCellTrigger[data-highlighted-start="true"].mrfokus-dp-CalendarCellTrigger[data-highlighted-end="true"] {
  border-radius: var(--dp-radius-day, 10px);
}

/* --- Прочие элементы --- */
.mrfokus-dp-CalendarGridRow:not(:last-of-type) .mrfokus-dp-CalendarCellTrigger {
  margin-bottom: var(--dp-cell-gap, 2px);
}
.mrfokus-dp-CalendarCellTrigger:not(:last-of-type) {
  padding-right: var(--dp-cell-gap, 2px);
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
.mrfokus-dp-CalendarWrapperGrid {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
</style>
