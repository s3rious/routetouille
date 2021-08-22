import { createStore } from 'effector-logger'
import { persist } from 'effector-storage/local'

const $hideGui = createStore(false, { name: 'root/$hideGui' })

persist({
  store: $hideGui,
  key: 'HIDE_GUI',
})

export { $hideGui }
