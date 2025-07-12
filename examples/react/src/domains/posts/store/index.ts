import { type Store, combine, createStore } from "effector";

import * as effects from "./effects.js";
import { PostModel, PostsModel } from "./model/index.js";

const $posts = createStore(new PostsModel(), { name: "posts/$posts" }).on(
  effects.fetchPosts.doneData,
  (_state, posts) => new PostsModel(...posts),
);

const $isPostsLoading = combine(
  Object.values(effects).map((effect) => effect.pending),
  (pendings: boolean[]) => pendings.some(Boolean),
) as Store<boolean>;

export { $posts, $isPostsLoading, effects, PostsModel, PostModel };
