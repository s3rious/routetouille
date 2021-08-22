import * as React from 'react'
import { Fragment, ReactElement } from 'react'

import { useList } from 'domains/posts/domains/list/hooks/useList'

import { Preloader } from 'components/atoms/Preloader'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'

import { AuthLayout } from 'domains/client/domains/auth/components/AuthLayout'
import { PostCard } from 'domains/posts/components/PostCard'

function List(): ReactElement {
  const { loading, posts } = useList()

  return (
    <Fragment>
      <Preloader shown={loading} />
      <AuthLayout
        content={
          <Fragment>
            <Stack vertical={32}>
              <Stack vertical={12}>
                <Typography size={16} lineHeight="small" mix>
                  <Link to="dashboard">← Dashboard</Link>
                </Typography>
                <Typography size={32} weight="semi-bold" lineHeight="small">
                  Posts
                </Typography>
              </Stack>
              <Stack vertical={24}>
                {posts.map((post, index) => (
                  <PostCard key={post.id ?? index} post={post} skeleton={loading} />
                ))}
              </Stack>
            </Stack>
          </Fragment>
        }
      />
    </Fragment>
  )
}

export { List }
