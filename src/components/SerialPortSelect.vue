<script setup lang="ts">
  import { NButton, NIcon, NSelect, NDrawer, NDrawerContent, NTable, NFormItem, NSpace } from 'naive-ui'
  import { ref, computed, defineProps, defineEmits, watch, onMounted } from 'vue'
  import { MdRefresh } from '@vicons/ionicons4'
  import { Info28Regular } from '@vicons/fluent'
  import type { PortInfo }  from "@serialport/bindings-interface"

  const props = defineProps<{ 
    portPathHint: string,
    disabled: boolean 
  }>()
  const emit = defineEmits<{ portPathSelected: [path: string | null] }>()

  const portlist = ref<PortInfo[]>([])
  const selectedPort = ref<PortInfo | null>(null)
  const portInfoVisible = ref<boolean>(false)

  const portSelectOptions = computed(() => {
    return portlist.value.map(item => {
      return {
        value: item.path,
        label: item.path,
      }
    })
  })

  const selectedPortPath = computed<string | null>({
    get: () => {
      return selectedPort.value?.path || null
    },
    set: (value) => {
      selectedPort.value = portlist.value.find(port => port.path === value) || null
    }
  })

  watch(selectedPort, (newPort, oldPort) => {
    console.log(newPort)
    if (newPort !== oldPort) {
      emit('portPathSelected', newPort?.path || null)
    }
  })

  async function listSerialPorts() {
    const ports: PortInfo[] = await window.api.listPorts()
    portlist.value.splice(0, portlist.value.length)
    ports.forEach(port => {
      portlist.value.push(port)
    })
    if (firstTimeAfterMount) {
      firstTimeAfterMount = false
      assignHint()
    }
  }

  function showPortInfo() {
    if (selectedPort) {
      portInfoVisible.value = true
    }
  }

  let firstTimeAfterMount = false
  onMounted(() => {
    if (portlist.value.length) {
      assignHint()
    } else {
      firstTimeAfterMount = true
    }
  })

  function assignHint() {
    const port = portlist.value.find(item => item.path === props.portPathHint)
    if (port) {
      selectedPort.value = port
    }
  }

  listSerialPorts()

</script>


<template>
  <div>
    <n-space>
      <n-form-item label="Serial port" path="selectedPortPath" class="selectItem" size="small">
        <n-select v-model:value="selectedPortPath" :options="portSelectOptions" placeholder="Select Serial port" :disabled="props.disabled"></n-select>
      </n-form-item>
      <n-form-item size="small">
        <n-button text style="font-size: 24px" @click="showPortInfo" :disabled="props.disabled">
          <n-icon>
            <Info28Regular />
          </n-icon>
        </n-button>
      </n-form-item>
      <n-form-item size="small">
        <n-button text style="font-size: 24px" @click="listSerialPorts" :disabled="props.disabled">
          <n-icon>
            <MdRefresh />
          </n-icon>
        </n-button>
      </n-form-item>
    </n-space>

    <n-drawer v-model:show="portInfoVisible" :width="'50%'" :placement="'right'">
      <n-drawer-content>
        <h2>Selected Serial Port</h2>
        <n-table :bordered="false" :single-line="false">
          <thead>
            <tr>
              <th>Property</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Path</td>
              <td>{{ selectedPort?.path || 'N/A' }}</td>
            </tr>
            <tr>
              <td>Manufacturer</td>
              <td>{{ selectedPort?.manufacturer || 'N/A' }}</td>
            </tr>
            <tr>
              <td>Serial Number</td>
              <td>{{ selectedPort?.serialNumber || 'N/A' }}</td>
            </tr>
            <tr>
              <td>PnP ID</td>
              <td>{{ selectedPort?.pnpId || 'N/A' }}</td>
            </tr>
            <tr>
              <td>Location ID</td>
              <td>{{ selectedPort?.locationId || 'N/A' }}</td>
            </tr>
            <tr>
              <td>Product ID</td>
              <td>{{ selectedPort?.productId || 'N/A' }}</td>
            </tr>
            <tr>
              <td>Vendor ID</td>
              <td>{{ selectedPort?.vendorId || 'N/A' }}</td>
            </tr>
          </tbody>
        </n-table>
      </n-drawer-content>
    </n-drawer>
  </div>
</template>

<style>

.selectItem {
  min-width: 300px;
}

</style>
