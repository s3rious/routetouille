import { useUnit } from "effector-react";

import type { RouterInterface } from "services/router";

import { $isPostsLoading, $posts, type PostModel } from "domains/posts";

type UseListInterface = {
  loading: boolean;
  post: PostModel | undefined;
};

function usePost(router: RouterInterface): UseListInterface {
  const params: Record<string, unknown> = {};
  for (const param of router.params) {
    Object.assign(params, param);
  }
  const postId =
    typeof params.postId === "string"
      ? Number.parseInt(params.postId, 10)
      : undefined;
  const loading = Boolean(useUnit($isPostsLoading));
  const postsStore = useUnit($posts) as {
    getById: (id: number) => PostModel | undefined;
  };
  const post =
    typeof postId === "number" && !Number.isNaN(postId)
      ? postsStore.getById(postId)
      : undefined;

  return { loading, post };
}

export { usePost, type UseListInterface };
