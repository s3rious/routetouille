import * as React from 'react'
import { Fragment, ReactElement } from 'react'

import { useDashboard } from 'domains/dashboard/hooks/useDashboard'

import { Preloader } from 'components/atoms/Preloader'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'

import { AuthLayout } from 'domains/client/domains/auth/components/AuthLayout'
import { PostCard } from 'domains/posts/components/PostCard'

function Dashboard(): ReactElement {
  const { loading, posts } = useDashboard()

  return (
    <Fragment>
      <Preloader shown={loading} />
      <AuthLayout
        content={
          <Fragment>
            <Stack vertical={32}>
              <Typography size={32} weight="semi-bold" lineHeight="small">
                My dashboard
              </Typography>
              <Fragment>
                <Stack vertical={32}>
                  <Stack horizontal={12} align="baseline">
                    <Typography size={24} weight="semi-bold" lineHeight="small">
                      Last posts
                    </Typography>
                    <Typography size={16} lineHeight="small" mix>
                      <Link to="posts-list">See all</Link>
                    </Typography>
                  </Stack>
                  <Stack vertical={24}>
                    {posts.map((post, index) => (
                      <PostCard key={post?.id ?? index} post={post} skeleton={loading} />
                    ))}
                  </Stack>
                </Stack>
              </Fragment>
            </Stack>
          </Fragment>
        }
      />
    </Fragment>
  )
}

export { Dashboard }
