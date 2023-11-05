<script setup lang="ts">
import { ref } from 'vue'
import { NSpace, NFormItem, NInput, NSpin, NSwitch, NButton, NInputNumber, NDropdown, NForm, NLog, NDivider, NCheckbox } from 'naive-ui'

const searching = ref<boolean>(true)
const shortAddress = ref<number>(0)
const searchRange = ref<{ min: number, max: number }>({
  min: 0,
  max: 0xFFFFFF
})
const searchAddress = ref<number>(0)
const gotBallast = ref<boolean>(false)

const resetRangeOptions = ref([{
  label: 'To last positive search',
  key: 'last',
  props: {
    onClick: () => {}
  }
}, {
  label: 'From scratch',
  key: 'scratch',
  props: {
    onClick: () => {}
  }
}])
const searchLog = ref<string>(
`Step 1: Min 0x00000, Max 0xFFFFFF, search 0x800000, got response => going up
Step 2: Min 0x80000, Max 0xFFFFFF, search 0xA00000, got response => going up`
)

function selectResetRange() {
  console.log('maucta')
}

function commenceSearch() {
  searching.value = true
}

function stopSearch() {
  searching.value = false
}

function hexFormater(value: number | null): string {
  if (value === null || value < 0) {
    return ''
  }
  let pad = '0x'
  if (value === 0) {
    pad = '0x00000'
  } else {
    let cmp = 0x100000
    while (value < cmp) {
      cmp = cmp >> 4
      pad +='0'
    }
  }
  return pad + value?.toString(16).toUpperCase()
}

function hexParser(input: string): number | null {
  if (input.length > 2 && input.substring(0,2) === '0x') {
    input = input.substring(2)
  }
  const value = parseInt(input, 16)
  return isNaN(value) ? null : value
}

</script>

<template>
  <h2>Ballast Search</h2>
  <h3>Search address</h3>
  <n-space size="small" :inline="true" :wrap="false">
    <n-form-item label="Min" path="" label-placement="top" size="small">
      <n-input-number v-model:value="searchRange.min" :format="hexFormater" :parse="hexParser" :min="0x0" :max="0xFFFFFF" :disabled="searching" />
    </n-form-item>
    <n-form-item label="Max" path="" label-placement="top" size="small">
      <n-input-number v-model:value="searchRange.max" :format="hexFormater" :parse="hexParser" :min="0x0" :max="0xFFFFFF" :disabled="searching" />
    </n-form-item>
    <n-form-item label="Actual" path="" label-placement="top" size="small">
      <n-input-number v-model:value="searchAddress" :format="hexFormater" :parse="hexParser" :min="0x0" :max="0xFFFFFF" :disabled="searching" />
    </n-form-item>
  </n-space>
  <n-space justify="right">
      <div v-if="!searching">
      <n-dropdown size="small" trigger="click" :options="resetRangeOptions" @select="selectResetRange">
        <n-button size="small" strong type="tertiary">Reset Search Address</n-button>
      </n-dropdown>
      </div>
      <n-button @click="commenceSearch()" strong type="primary" size="small" v-if="!searching">Search</n-button>
      <n-button @click="stopSearch()" strong secondary type="error" size="small" v-if="searching">Stop</n-button>
  </n-space>

  <h3>Report</h3>
  <n-log :rows="15" :log="searchLog" :font-size="10" />

  <n-divider></n-divider>

  <div v-if="searching">
    <n-space justify="space-around">
      <n-spin></n-spin>
    </n-space>
  </div>

  <div v-if="!searching">
    <n-space>
    <h3>Ballast</h3>
    </n-space>
    <n-space align="stretch" :inline="true" :wrap="false">
      <n-form-item label="Short address" path="" label-placement="left" size="small">
        <n-input-number min="0" max="63" clearable v-model:value="shortAddress" />
      </n-form-item>
      <n-form-item label="Mark as duplicit" path="" label-placement="left" size="small" justify="center">
        <n-switch></n-switch>
      </n-form-item>
      <div class="endbutton">
        <n-button size="small" strong secondary type="primary">Assign</n-button>
      </div>
    </n-space>
    <n-space justify="space-between" align="end">
    <n-space vertical>
      <n-checkbox :disabled="true">
        Withdrawn
      </n-checkbox>
      <n-checkbox :disabled="true">
        Duplicit in previous search
      </n-checkbox>
    </n-space>
    <n-space justify="right" >
      <n-button size="small" strong secondary type="primary">Identify</n-button>
      <n-button size="small" strong secondary type="primary">Withdraw</n-button>
    </n-space>
  </n-space>
  </div>
</template>

<style>

div.endbutton {
  padding-left: 12px;
}

</style>