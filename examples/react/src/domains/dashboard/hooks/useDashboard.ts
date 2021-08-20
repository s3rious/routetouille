import { useStore } from 'effector-react'

import { $posts, $isPostsLoading, PostModel } from 'domains/posts'

type UseDashboardInterface = {
  loading: boolean
  latestPosts: Array<Partial<PostModel>>
}

function useDashboard(): UseDashboardInterface {
  const loading = useStore($isPostsLoading)
  const latestPosts = useStore($posts).getLatest()

  return {
    loading,
    latestPosts: latestPosts.length < 1 && loading ? Array.from({ length: 5 }).map(() => ({})) : latestPosts,
  }
}

export { useDashboard }
