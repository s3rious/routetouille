import { useStore } from 'effector-react'

import { RouterInterface } from 'services/router'

import { $posts, $isPostsLoading, PostModel } from 'domains/posts'

type UseListInterface = {
  loading: boolean
  post: PostModel | undefined
}

function usePost(router: RouterInterface): UseListInterface {
  const params = router.params.reduce((params, param) => ({ ...params, ...param }), {})
  const postId = parseInt(params.postId, 10)
  const loading = useStore($isPostsLoading)
  const post = useStore($posts).getById(postId)

  return { loading, post }
}

export { usePost, UseListInterface }
