import { Store } from 'effector'
// import { createStore, combine } from 'effector'
import { createStore, combine } from 'effector-logger'

import { PostsModel, PostModel } from './model'
import * as effects from './effects'

const $posts = createStore(new PostsModel(), { name: `posts/$posts` }).on(
  effects.fetchPosts.doneData,
  (state, posts) => new PostsModel(...posts),
)

const $isPostsLoading: Store<boolean> = combine(
  // @ts-expect-error feels like effector’s typing error
  ...Object.values(effects).map((effect) => effect.pending),
  (...pendings: boolean[]) => pendings.some((pending) => pending),
)

export { $posts, $isPostsLoading, effects, PostsModel, PostModel }
