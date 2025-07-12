import { Fragment, type ReactElement } from "react";

import { useList } from "domains/posts/domains/list/hooks/useList";
import { Preloader } from "components/atoms/Preloader";
import { Stack } from "components/atoms/Stack";
import { Typography } from "components/atoms/Typography";

import { AuthLayout } from "domains/client/domains/auth/components/AuthLayout";
import { PostCard } from "domains/posts/components/PostCard";

function List(): ReactElement {
  const { loading, posts } = useList();

  return (
    <Fragment>
      <Preloader shown={loading} />
      <AuthLayout
        content={
          <Stack vertical={32}>
            <Stack vertical={12}>
              <Typography size={32} weight="semi-bold" lineHeight="small">
                Posts
              </Typography>
            </Stack>
            <Stack vertical={24}>
              {posts.map((post, index) => (
                <PostCard
                  key={
                    post.id
                      ? String(post.id)
                      : `post-${index}-${Math.random().toString(36).slice(2)}`
                  }
                  post={post}
                  skeleton={loading}
                />
              ))}
            </Stack>
          </Stack>
        }
      />
    </Fragment>
  );
}

export { List };
