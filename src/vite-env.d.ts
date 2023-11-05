/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

import type { ContextBridgeAPI } from '../electron/preload/index.ts'

declare global {
  interface Window {
    api: ContextBridgeAPI
  }
}
