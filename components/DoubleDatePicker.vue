<template>
  <div class="double-dp">
    <slot name="left">
      <DatePicker
        class="left-dp"
        :mode="mode"
        v-model:current-day="currentDayLeft"
        v-model:highlight-days="unitedHighlightDays"
        :model-value="modelValue"
        @update:model-value="setRange"
      >
        <template #next-button>
          <p class="empty"></p>
        </template>
        <template>
          <button @click="setMonth(-1)" class="prev">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M12.5 15L8.63137 11.1314C8.23535 10.7354 8.03735 10.5373 7.96316 10.309C7.8979 10.1082 7.8979 9.89183 7.96316 9.69098C8.03735 9.46265 8.23535 9.26465 8.63137 8.86863L12.5 5"
                stroke="#8C889A"
                stroke-width="1.67"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </template>
      </DatePicker>
    </slot>
    <slot name="center">
      <hr class="vertical-divider" />
    </slot>
    <slot name="right">
      <DatePicker
        class="right-dp"
        :mode="mode"
        v-model:current-day="currentDayRight"
        v-model:highlight-days="unitedHighlightDays"
        :model-value="modelValue"
        @update:model-value="setRange"
      >
        <template #next-button>
          <button @click="setMonth(1)" class="next">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
            >
              <path
                d="M7.5 15L11.3686 11.1314C11.7646 10.7354 11.9627 10.5373 12.0368 10.309C12.1021 10.1082 12.1021 9.89183 12.0368 9.69098C11.9627 9.46265 11.7646 9.26465 11.3686 8.86863L7.5 5"
                stroke="#8C889A"
                stroke-width="1.67"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </button>
        </template>
        <template #prev-button>
          <p class="empty"></p>
        </template>
      </DatePicker>
    </slot>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import DatePicker from './DatePicker.vue'
type ModelRange = {
  start: Date | null
  end: Date | null
}
const props = withDefaults(
  defineProps<{
    mode?: 'range' | 'pick'
    modelValue: ModelRange
  }>(),
  {
    mode: 'range'
  }
)

const emit = defineEmits<{
  'update:modelValue': [ModelRange]
}>()
const unitedHighlightDays = ref<Date[]>()

const currentDayLeft = ref<Date>(new Date())
const currentDayRight = ref<Date>()
currentDayLeft.value.setHours(0, 0, 0, 0)

watch(
  currentDayLeft,
  () => {
    currentDayRight.value = new Date(currentDayLeft.value)
    currentDayRight.value.setMonth(currentDayLeft.value.getMonth() + 1)
  },
  { immediate: true, deep: true }
)

function setMonth(value: number) {
  currentDayLeft.value.setMonth(currentDayLeft.value.getMonth() + value)
  currentDayLeft.value = new Date(currentDayLeft.value)
}

function setRange(range: ModelRange) {
  emit('update:modelValue', range)
}
</script>

<style>
.left-dp .monts-container .next {
  display: none;
}

.left-dp .monts-container .empty {
  width: 32px;
  height: 32px;
  display: flex;
}

.right-dp .monts-container .prev {
  display: none;
}

.right-dp .monts-container .empty {
  width: 32px;
  height: 32px;
  display: flex;
}

.left-dp,
.right-dp {
  background: none;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.left-dp .other-month-day,
.right-dp .other-month-day {
  display: none;
}

.left-dp .week:first-of-type,
.right-dp .week:first-of-type {
  width: fit-content;
  margin-left: auto;
}

.left-dp .week:last-of-type,
.right-dp .week:last-of-type,
.left-dp .week:nth-last-of-type(2),
.right-dp .week:nth-last-of-type(2) {
  width: fit-content;
  margin-right: auto;
}

.double-dp {
  display: flex;
  box-shadow:
    0px 0px 16px -2px rgba(14, 24, 41, 0.12),
    0px 12px 16px -4px rgba(14, 24, 41, 0.12);
  background: var(--dp-background, white);
  border-radius: 16px;
  gap: 8px;
  width: fit-content;
}

.double-dp .vertical-divider {
  border: none;
  border-left: 1px solid #f2f4f7;
  margin: 24px 4px;
}
</style>
