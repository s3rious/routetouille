import { createEffect } from "effector";

import * as api from "./api.js";

const fetchPosts = createEffect({
  name: "posts/fetchPosts",
  async handler() {
    return await api.fetchPosts();
  },
});

export { fetchPosts };
