import { useUnit } from "effector-react";

import { $isPostsLoading, $posts, PostsModel } from "domains/posts";

type UseListInterface = {
  loading: boolean;
  posts: PostsModel;
};

function useList(loadingLength = 10): UseListInterface {
  const loading = useUnit($isPostsLoading);
  let posts: PostsModel = useUnit($posts);

  if (posts.length < 1 && loading) {
    posts = new PostsModel(
      ...Array.from({ length: loadingLength }).map(() => ({})),
    );
  }

  return { loading, posts };
}

export { useList, type UseListInterface };
