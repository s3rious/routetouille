import { useStore } from 'effector-react'

import { $posts, $isPostsLoading, PostsModel } from 'domains/posts'

type UseListInterface = {
  loading: boolean
  posts: PostsModel
}

function useList(loadingLength: number = 10): UseListInterface {
  const loading = useStore($isPostsLoading)
  let posts: PostsModel = useStore($posts)

  if (posts.length < 1 && loading) {
    posts = new PostsModel(...Array.from({ length: loadingLength }).map(() => ({})))
  }

  return { loading, posts }
}

export { useList, UseListInterface }
