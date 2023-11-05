<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NButton, NDivider, NDrawer, NDrawerContent, NCheckbox, NTable, NSlider, NSpin, NSwitch, NSpace, NEmpty } from 'naive-ui'
import SearchBallast from './SearchBallast.vue'

enum CommissioningState {
  Off = 'ready',
  Initializing = 'initializing',
  Randomizing = 'randomizing',
  On = 'on',
  Terminating = 'terminating',
}

const searchBallastVisible = ref<boolean>(false)
const commissioningState = ref<CommissioningState>(CommissioningState.Off)
const timer = ref<Date | null>(null)
const wasRandomized = ref<boolean>(false)

function initialize() {
  if (commissioningState.value !== CommissioningState.Off) {
    return
  }
  commissioningState.value = CommissioningState.Initializing
  setTimeout(() => {
    commissioningState.value = CommissioningState.On
  }, 1000)
}

function randomize() {
  if (commissioningState.value !== CommissioningState.On) {
    return
  }
  commissioningState.value = CommissioningState.Randomizing
  setTimeout(() => {
    commissioningState.value = CommissioningState.On
  }, 1000)
}

function searchBallast() {
  if (commissioningState.value !== CommissioningState.On) {
    return
  }
  searchBallastVisible.value = true
}

function terminate() {
  if (commissioningState.value !== CommissioningState.On) {
    return
  }
  commissioningState.value = CommissioningState.Terminating
  setTimeout(() => {
    commissioningState.value = CommissioningState.Off
  }, 1000)
}

</script>

<template>
  <n-card title="Commissioning">
    <div v-if="commissioningState === CommissioningState.Off">
      <n-button @click="initialize" size="small" strong type="primary">Initialize</n-button>
    </div>

    <div v-if="commissioningState === CommissioningState.Initializing || commissioningState === CommissioningState.Randomizing || commissioningState === CommissioningState.Terminating">
      <n-space>
        <n-spin></n-spin>
      </n-space>
    </div>

    <div v-if="commissioningState === CommissioningState.On">
      <n-space justify="space-between">
        <n-space>
          <n-button @click="terminate" strong secondary type="error" size="small">Terminate</n-button>
          <n-button @click="randomize" strong secondary type="primary" size="small">Randomize</n-button>
          <n-button @click="searchBallast" strong secondary type="primary" size="small">Search Ballast</n-button>
        </n-space>
        
        <n-space>
          <n-checkbox :disabled="true">
            Was randomized
          </n-checkbox>
          <div>Initialization timer</div>
        </n-space>
      </n-space>
    </div>

    <n-divider />

    <n-table>
      <thead>
        <th>#Short</th>
        <th>#Random</th>
        <th>Duplicate</th>
        <th>Brightness</th>
        <th>Actions</th>
      </thead>
      <tbody>
        <tr>
          <td>12</td>
          <td>0xFA1D01</td>
          <td><n-switch disabled></n-switch></td>
          <td><n-slider></n-slider></td>
          <td><n-button size="small">F</n-button><n-button size="small">X</n-button></td>
        </tr>
      </tbody>
    </n-table>
    <n-empty description="No ballast found yet.">
    </n-empty>
    
  </n-card>

  <n-drawer v-model:show="searchBallastVisible" :width="600" :min-width="600" :placement="'right'">
    <n-drawer-content>
      
      <search-ballast></search-ballast>

    </n-drawer-content>
  </n-drawer>
</template>

<style>
</style>