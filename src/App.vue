<script setup lang="ts">
import { NButton, NCard, NConfigProvider, NGrid, NGlobalStyle, NGi, NSpace, NLayout, NLayoutContent, NIcon, NSelect } from 'naive-ui'
import { useOsTheme, darkTheme } from 'naive-ui'
import { MdRefresh } from '@vicons/ionicons4'
import { ref, computed } from 'vue'
import type { PortInfo }  from "@serialport/bindings-interface"
import Master from './components/Master.vue'
import Commissioning from './components/Commissioning.vue'

const osThemeRef = useOsTheme()
const theme = computed(() => {
  return osThemeRef.value === 'dark' ? darkTheme : null
}) 

const portlist = ref<PortInfo[]>([])
const options = computed(() => {
  return portlist.value.map(item => {
    return {
      key: item.path,
      label: item.path,
    }
  })
})

const daliMaster = {
  key: 'foxtron-ascii-dali',
  label: 'Foxtron ASCII DALI'
}
const daliMasters = [daliMaster]

const bootTypes = [{
  key: '0',
  label: 'Instant'
}, {
  key: '0',
  label: 'Wait'
}, {
  key: '0',
  label: 'Set DTR & Wait'
}]

const selectedPortPaht = ref<string | null>(null)

const selectedPort = ref<PortInfo | null>(null)
function handleSelect(key: string) {
  selectedPort.value = portlist.value.find(port => port.path === key) || null
}

async function listSerialPorts() {
  const ports: PortInfo[] = await window.api.listPorts()
  portlist.value.splice(0, portlist.value.length)
  ports.forEach(port => {
    portlist.value.push(port)
  })
}

listSerialPorts()

</script>

<template>
  <n-config-provider :theme="theme">
    <n-global-style />

    <n-space vertical size="large">
      <n-layout>
        <n-layout-content content-style="padding: 12px;">
          <master></master>
        </n-layout-content>
      </n-layout>

      <n-layout>
        <n-layout-content content-style="padding: 0px 12px 12px 12px;">
          <commissioning></commissioning>
        </n-layout-content>
      </n-layout>
    </n-space>
  </n-config-provider>

</template>

<style>

</style>
