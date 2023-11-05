<script setup lang="ts">
import { ref } from 'vue'
import { NTable, NSelect, NUl, NLi, NCard, NButton, NDivider, NFormItem, NSwitch, NSpin, NSpace } from 'naive-ui';
import SerialPortSelect from './SerialPortSelect.vue'

const enum DaliMasterKey {
  FoxtronDALI232 = 'foxtron-dali-232'
}

const enum BootMode {
  Running = 'running',
  Wait = 'wait',
  SetDTRAndWait = 'set-dtr-wait'
}

const enum SerialPortParity {
  Even = 'even',
  Odd = 'odd',
  None = 'none'
}

const enum FoxtronProtocol {
  ASCII = 'ASCII',
  ModBus = 'modbus'
}

type DaliMasterConfig = {
  serialPortPath: string | null,
  protocol: FoxtronProtocol
  parity: SerialPortParity,
  speed: number,
  stopBits: number,
  bootMode: BootMode
}

type DaliMasterOption = {
  value: string,
  label: string
}

type BootModeOption = {
  value: BootMode,
  label: string
}

const daliMaster: DaliMasterOption = {
  value: DaliMasterKey.FoxtronDALI232,
  label: 'Foxtron DALI232'
}
const daliMasters = ref<DaliMasterOption[]>([daliMaster])
const selectedDaliMasterOption = ref<DaliMasterKey | null>(DaliMasterKey.FoxtronDALI232)
const daliMasterConfig = ref<DaliMasterConfig>({
  serialPortPath: null,
  protocol: FoxtronProtocol.ASCII,
  parity: SerialPortParity.Even,
  speed: 19200,
  stopBits: 1,
  bootMode: BootMode.SetDTRAndWait
})
const protocolOptions = ref([{
  value: FoxtronProtocol.ASCII,
  label: 'ASCII'
}])
const bootModeOptions = ref<BootModeOption[]>([{
  value: BootMode.Running,
  label: 'Master is running'
}, {
  value: BootMode.Wait,
  label: 'Wait until booted'
}, {
  value: BootMode.SetDTRAndWait,
  label: 'Set DTR to power master and wait until booted'
}])

const enum ConnectionStatus {
  Disconnected = 'disconnected',
  Connecting = 'connecting',
  Connected = 'connected',
  Disconnecting = 'disconnecting'
}
const connStatus = ref<ConnectionStatus>(ConnectionStatus.Disconnected)

const enum DaliBusStats {
  OK,
  NoVoltage,
  PSVoltage,
  BadVoltage
}

type FoxtronStatus = {
  daliBusStatus: DaliBusStats,
  serialNumber: string,
  bufferCount: number,
  hwVersion: string,
  activeCs: boolean
}
const foxStatus = ref<FoxtronStatus>({
  daliBusStatus: DaliBusStats.NoVoltage,
  serialNumber: '',
  bufferCount: 0,
  hwVersion: '',
  activeCs: true
})

const cmdInProgress = ref<bool>(false)

function connect() {
  if (connStatus.value !== ConnectionStatus.Disconnected) {
    return
  }
  connStatus.value = ConnectionStatus.Connecting
  setTimeout(() => {
    connStatus.value = ConnectionStatus.Connected
  }, 1000)
}

function disconnect() {
  if (connStatus.value !== ConnectionStatus.Connected) {
    return
  }
  connStatus.value = ConnectionStatus.Disconnecting
  setTimeout(() => {
    connStatus.value = ConnectionStatus.Disconnected
  }, 1000)
}

function resetError() {
  if (connStatus.value !== ConnectionStatus.Connected || cmdInProgress) {
    return
  }
  cmdInProgress.value = true
  setTimeout(() => {
    cmdInProgress.value = false
  }, 1000)
}

</script>

<template>
  <n-card title="DALI Master">
    <n-select size="small" 
      v-model:value="selectedDaliMasterOption" 
      :options="daliMasters" 
      :default-value="DaliMasterKey.FoxtronDALI232" 
      :disabled="connStatus !== ConnectionStatus.Disconnected"
      placeholder="Select DALI Master type"></n-select>

    <n-divider />

    <div v-if="connStatus === ConnectionStatus.Disconnected || connStatus === ConnectionStatus.Connecting">

      <serial-port-select 
        v-model="daliMasterConfig.serialPortPath" 
        :port-path-hint="daliMasterConfig.serialPortPath || 'null'" 
        :disabled="connStatus !== ConnectionStatus.Disconnected" />

      <n-space>
        <n-form-item label="Protocol" path="daliMasterConfig.protocol" class="standardInputWidth">
          <n-select v-model:value="daliMasterConfig.protocol" :options="protocolOptions" placeholder="Select Protocol" :disabled="connStatus !== ConnectionStatus.Disconnected" />
        </n-form-item>
        <n-form-item label="Boot Mode" path="daliMasterConfig.protocol" class="standardInputWidthBoot">
          <n-select v-model:value="daliMasterConfig.bootMode" :options="bootModeOptions" placeholder="Select Boot Mode" :disabled="connStatus !== ConnectionStatus.Disconnected" />
        </n-form-item>
      </n-space>

      <n-table size="small">
        <thead>
          <th>Speed</th>
          <th>Parity</th>
          <th>Stop bits</th>
        </thead>
        <tbody>
          <tr>
            <td>{{daliMasterConfig.speed}}</td>
            <td>{{daliMasterConfig.parity}}</td>
            <td>{{daliMasterConfig.stopBits}}</td>
          </tr>
        </tbody>
      </n-table>

      <n-space>
        <div>&nbsp;</div>
      </n-space>

    </div>

    <n-space v-if="connStatus === ConnectionStatus.Disconnected" justify="end">
        <n-button size="small" @click="connect" strong type="primary">Connect</n-button>
    </n-space>

    <n-space v-if="connStatus === ConnectionStatus.Connected" justify="space-between">
      <strong>DALI Master Connected</strong>
      <n-space>
        <n-spin size="small" v-if="cmdInProgress" />
        <n-button size="small" @click="resetError">Reset Error</n-button>
        <n-button size="small" @click="disconnect" strong type="error" secondary>Disconnect</n-button>
      </n-space>
    </n-space>

    <n-space v-if="connStatus === ConnectionStatus.Connecting" justify="space-between">
      <div>Connecting ...</div>
      <n-spin size="small" />
    </n-space>

    <n-space v-if="connStatus === ConnectionStatus.Disconnecting" justify="space-between">
      <div>Disconnecting ...</div>
      <n-spin size="small" />
    </n-space>
    
    <n-space v-if="connStatus === ConnectionStatus.Connected">
      <div>&nbsp;</div>
    </n-space>

    <n-table size="small" v-if="connStatus === ConnectionStatus.Connected">
      <thead>
        <th>DALI Bus</th>
        <th>Serial number</th>
        <th>Buffer Count</th>
        <th>HW Version</th>
        <th>Use Checksum</th>
      </thead>
      <tbody>
        <tr>
          <td>{{foxStatus.daliBusStatus}}</td>
          <td>{{foxStatus.serialNumber}}</td>
          <td>{{foxStatus.bufferCount}}</td>
          <td>{{foxStatus.hwVersion}}</td>
          <td><n-switch v-model:value="foxStatus.activeCs" /></td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<style>

.standardInputWidth {
  min-width: 200px;
}

.standardInputWidthBoot {
  min-width: 360px;
}

</style>