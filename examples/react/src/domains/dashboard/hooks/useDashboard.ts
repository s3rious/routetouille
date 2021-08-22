import { useList, UseListInterface } from 'domains/posts/domains/list/hooks/useList'

function useDashboard(): UseListInterface {
  const { loading, posts: allPosts } = useList(5)
  const posts = allPosts.getLatest()

  return {
    loading,
    posts,
  }
}

export { useDashboard }
