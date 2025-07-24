<template>
  <div class="date-picker" :class="{'process-select':isProcessRangeSelect()}">
    <slot name="header">
      <header class="monts-container">
        <slot v-bind="{ setMonth }" name="prev-button">
          <button @click="setMonth(-1)" class="prev">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M12.5 15L8.63137 11.1314C8.23535 10.7354 8.03735 10.5373 7.96316 10.309C7.8979 10.1082 7.8979 9.89183 7.96316 9.69098C8.03735 9.46265 8.23535 9.26465 8.63137 8.86863L12.5 5"
                stroke="#8C889A" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </slot>
        <slot v-bind="{ currentDay }" name="current-day">
          {{ month[currentDay.getMonth()] }} {{ currentDay.getFullYear() }}
        </slot>
        <slot v-bind="{ setMonth }" name="next-button">
          <button @click="setMonth(1)" class="next">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M7.5 15L11.3686 11.1314C11.7646 10.7354 11.9627 10.5373 12.0368 10.309C12.1021 10.1082 12.1021 9.89183 12.0368 9.69098C11.9627 9.46265 11.7646 9.26465 11.3686 8.86863L7.5 5"
                stroke="#8C889A" stroke-width="1.67" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </slot>
      </header>
    </slot>
    <div class="days">
      <slot name="day-week" v-bind="{ daysWeek }">
        <ul class="days-week-container">
          <li class="day-week" v-for="day in daysWeek">{{ day }}</li>
        </ul>
      </slot>
      <slot name="days" v-bind="{ days, currentDay }">
        <transition name="fade" mode="out-in">
          <ul class="weeks" :key="currentDay.getFullYear() + '-' + currentDay.getMonth()">
            <li class="week" v-for="(week, index) in days"
              :class="{ 'post-week-with-start-day': isWeekWithStartDay(days[index - 1]), 'prev-week-with-end-day': isWeekWithEndDay(days[index + 1]) }">
              <div v-for="(day, index) in week" @mousemove="changeIndicator(day)" class="indicator"
                :class="isHighlightDay(day)">
                <slot :name="day.getTime()"
                  v-bind="{ day, currentDay, selectDay, setDay, setRange, isToday, isOtherMonthDay, isActiveDay }">
                  <button class="day" @click="selectDay(day)"
                    :class="{ 'today': isToday(day), 'other-month-day': isOtherMonthDay(day, currentDay), active: isActiveDay(day) }">{{
                      day.getDate() }}
                  </button>
                </slot>
              </div>
            </li>
          </ul>
        </transition>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type ModelRange = {
  start: Date | null,
  end: Date | null
}

type ModelPick = Date | null

const props = withDefaults(defineProps<{
  mode?: 'range' | 'pick',
  modelValue: ModelPick | ModelRange
}>(), {
  mode: 'range',
})

const emit = defineEmits<{
  'update:modelValue': [ModelPick | ModelRange]
}>()
const daysWeek = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
const month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]

const currentDay = defineModel('currentDay',{default:new Date()})
currentDay.value.setHours(0, 0, 0, 0)

const days = computed<Date[][]>(() => calculateDays(currentDay.value))

const highlightDays = defineModel<Date[]>('highlightDays',{default:[]})
const startDay = ref<Date | null>()
const endDay = ref<Date | null>()
const moveStartDay = ref<Date | null>()
const moveEndDay = ref<Date | null>()

watch(() => props.modelValue, () => {
  changeModelValue()
}, { deep: true, immediate: true })
watch(() => [startDay.value, endDay.value], () => {
  changeLocalValue()
}, { deep: true, immediate: true })
watch(() => [endDay.value], () => {
  if(startDay.value && endDay.value)
  highlightDays.value = getHighlightDays(startDay.value, endDay.value)
}, { deep: true, immediate: true })


function changeModelValue() {
  if (!props.modelValue) return
  if (props.mode == 'range' && isRangeType(props.modelValue)) {
    startDay.value = props.modelValue.start
    endDay.value = props.modelValue.end
  }
  else if (props.mode == 'pick' && isPickType(props.modelValue)) {
    startDay.value = props.modelValue
    endDay.value = props.modelValue
  }
}

function changeLocalValue() {
  if (!props.modelValue) return
  if (props.mode == 'range' && startDay.value !== undefined && endDay.value !== undefined) {
    emit('update:modelValue', {
      start: startDay.value,
      end: endDay.value
    })
  }
  else if (props.mode == 'pick' && startDay.value !== undefined) {
    emit('update:modelValue', startDay.value)
  }
}


function isRangeType(value: unknown): value is ModelRange {
  return typeof value === 'object' &&
    value !== null &&
    'start' in value &&
    'end' in value;
}

function isProcessRangeSelect(){
  if(props.mode == 'pick') return false
  return startDay.value && !endDay.value
}

function isPickType(value: ModelPick | ModelRange): value is ModelPick {
  return value instanceof Date;
}
function calculateDays(current: Date) {
  const date = new Date(current)
  date.setHours(0, 0, 0, 0)
  date.setDate(1)

  const firstDayIndex = (date.getDay() + 6) % 7
  date.setDate(date.getDate() - firstDayIndex)

  const days = Array.from({ length: 6 }, () => new Array(7))

  for (let week = 0; week < 6; week++) {
    for (let day = 0; day < 7; day++) {
      days[week]![day] = new Date(date)
      date.setDate(date.getDate() + 1)
    }
  }

  return days
}

function isToday(date: Date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return today.getTime() === date.getTime()
}

function isOtherMonthDay(day: Date, current: Date) {
  return day.getMonth() !== current.getMonth()
}

function setMonth(value:number) {
  currentDay.value.setMonth(currentDay.value.getMonth() + value)
  currentDay.value = new Date(currentDay.value)
}

function setRange(day: Date) {
  if (!startDay.value || (startDay.value && endDay.value)) {
    highlightDays.value = []
    startDay.value = day
    endDay.value = null
    return
  }
  endDay.value = day
  if (endDay.value.getTime() < startDay.value.getTime()) {
    [startDay.value, endDay.value] = [endDay.value, startDay.value]
  }
}

function setDay(day: Date) {
  if (!startDay.value || (startDay.value && endDay.value)) {
    highlightDays.value = []
    startDay.value = day
    endDay.value = day
    return
  }
}

function selectDay(day: Date) {
  switch (props.mode) {
    case 'range':
      setRange(day)
      break
    case 'pick':
      setDay(day)
      break

  }
}

function isActiveDay(day: Date) {
  const t = day.getTime()
  return startDay.value?.getTime() === t || endDay.value?.getTime() === t
}


function changeIndicator(date: Date) {
  if (startDay.value && !endDay.value) {
    highlightDays.value = getHighlightDays(startDay.value, date)
  }
}

function getHighlightDays(from: Date, to: Date): Date[] {
  if (from.getTime() > to.getTime()) {
    [from, to] = [to, from];
  }
  const result: Date[] = []
  const current = new Date(from)

  moveStartDay.value = from
  moveEndDay.value = to
  while (current.getTime() <= to.getTime()) {
    result.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  return result
}

function isHighlightDay(day: Date) {
  const index = highlightDays.value.findIndex(d => d.getTime() === day.getTime())
  if (index === -1) return ''
  return {
    highlight: true,
    start: index === 0,
    end: index === highlightDays.value.length - 1
  }
}


function isWeekWithStartDay(week?: Date[]) {
  if (!moveStartDay.value || !week?.length || !moveStartDay.value) return false
  return week.some(d => d.getTime() === moveStartDay.value!.getTime())
}
function isWeekWithEndDay(week?: Date[]) {
  if (!moveEndDay.value || !week?.length || !moveEndDay.value) return false
  return week.some(d => d.getTime() === moveEndDay.value!.getTime())
}
</script>

<style>
.date-picker {
  display: flex;
  flex-direction: column;
  gap: var(--dp-gap, 16px);
  color: var(--dp-text-color, #191135);
  text-align: center;
  font-family: "Geologica", sans-serif;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px;
  width: fit-content;
  border-radius: var(--dp-border-radius, 24px);
  border: var(--dp-border, 1px solid #E8E7EB);
  background-color: var(--dp-background, white);
  box-shadow: 0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03);
  padding: var(--dp-padding, 16px);
}

.date-picker * {
  list-style: none;
  padding: 0;
  margin: 0;
}

.days {
  display: flex;
  flex-direction: column;
}

.days .weeks {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.days .week,
.days .days-week-container {
  display: flex;
  border-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.monts-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date-picker .day,
.date-picker .day-week {
  display: flex;
  background-color: transparent;
  border: none;
  width: 32px;
  height: 32px;
  align-items: center;
  justify-content: center;
}

.date-picker .day-week {
  font-weight: 500;
}

.date-picker .day {
  cursor: pointer;
  border-radius: var(--dp-days-border-radius, 10px);
  color: var(--dp-text-color, #191135);

}
/* .date-picker.process-select .day:not(.active):hover {
  background: var(--dp-day-highlight,#F2F4F7);
} */

.date-picker .today {
  color: var(--dp-primary, #0E1829);
  border: 1px solid var(--dp-primary, #0B182A);
  background: transparent;
}

.date-picker .monts-container .prev,
.date-picker .monts-container .next {
  display: flex;
  height: fit-content;
  width: fit-content;
  padding: 8px;
  border-radius: 12px;
  border: none;
  /* border: var(--dp-border, 1px solid #E8E7EB); */
  background: var(--dp-background, #FFF);
  cursor: pointer;
}

.date-picker .other-month-day {
  color: var(--dp-other-month-color, #9C99A8);
}

.date-picker .active,.date-picker.process-select .day:not(.active):hover {
  color: white;
  background-color: var(--dp-primary, #0E1829);
}

.date-picker .indicator {
  display: flex;
}

.date-picker .indicator.highlight {
  background: var(--dp-day-highlight,#F2F4F7);
}

.date-picker .indicator.highlight.start {
  border-top-left-radius: var(--dp-days-border-radius, 10px);
  border-bottom-left-radius: var(--dp-days-border-radius, 10px);
}

.date-picker .indicator.highlight.end {
  border-top-right-radius: var(--dp-days-border-radius, 10px);
  border-bottom-right-radius: var(--dp-days-border-radius, 10px);
}

.date-picker .week:has(.indicator.highlight.end) {
  border-bottom-left-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.date-picker .week:has(.indicator.highlight.start) {
  border-top-right-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.date-picker .post-week-with-start-day {
  border-top-left-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.date-picker .prev-week-with-end-day {
  border-bottom-right-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.date-picker .week:last-of-type {
  border-bottom-right-radius: var(--dp-days-border-radius, 10px);
  border-bottom-left-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.date-picker .week:first-of-type {
  border-top-right-radius: var(--dp-days-border-radius, 10px);
  border-top-left-radius: var(--dp-days-border-radius, 10px);
  overflow: hidden;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.1s ease, transform 0.1s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>