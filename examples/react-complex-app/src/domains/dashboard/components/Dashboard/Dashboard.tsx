import { Fragment, type ReactElement } from "react";

import { useDashboard } from "domains/dashboard/hooks/useDashboard";

import { Link } from "components/atoms/Link";
import { Preloader } from "components/atoms/Preloader";
import { Stack } from "components/atoms/Stack";
import { Typography } from "components/atoms/Typography";

import { AuthLayout } from "domains/client/domains/auth/components/AuthLayout";
import { PostCard } from "domains/posts/components/PostCard";

function Dashboard(): ReactElement {
  const { loading, posts } = useDashboard();

  return (
    <Fragment>
      <Preloader shown={loading} />
      <AuthLayout
        content={
          <Stack vertical={32}>
            <Typography size={32} weight="semi-bold" lineHeight="small">
              My dashboard
            </Typography>
            <Stack vertical={32}>
              <Stack horizontal={12} align="baseline">
                <Typography size={24} weight="semi-bold" lineHeight="small">
                  Last posts
                </Typography>
                <Typography size={16} lineHeight="small" mix>
                  <Link to="post-list">See all</Link>
                </Typography>
              </Stack>
              <Stack vertical={24}>
                {posts.map((post, index) => (
                  <PostCard
                    key={
                      post?.id
                        ? String(post.id)
                        : `post-${index}-${Math.random().toString(36).slice(2)}`
                    }
                    post={post}
                    skeleton={loading}
                  />
                ))}
              </Stack>
            </Stack>
          </Stack>
        }
      />
    </Fragment>
  );
}

export { Dashboard };
