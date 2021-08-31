import { createStore } from 'effector'
import { persist } from 'effector-storage/local'

const $hideGui = createStore(false, { name: 'root/$hideGui' })

persist({
  store: $hideGui,
  key: 'HIDE_GUI',
})

export { $hideGui }
