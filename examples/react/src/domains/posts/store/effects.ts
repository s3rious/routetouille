import { createEffect } from 'effector'

import * as api from './api'

const fetchPosts = createEffect({
  name: 'posts/fetchPosts',
  async handler() {
    return await api.fetchPosts()
  },
})

export { fetchPosts }
