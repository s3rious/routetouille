import * as React from 'react'
import { Fragment, ReactElement } from 'react'

import { RouterInterface } from 'services/router'

import { usePost } from 'domains/posts/domains/post/hooks/usePost'

import { Preloader } from 'components/atoms/Preloader'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'
import { SkeletonTypography } from 'components/molecules/SkeletonTypography'

import { AuthLayout } from 'domains/client/domains/auth/components/AuthLayout'

type PostProps = {
  router: RouterInterface
}

function Post({ router }: PostProps): ReactElement {
  const { loading, post } = usePost(router)

  return (
    <Fragment>
      <Preloader shown={loading} />
      <AuthLayout
        content={
          <Fragment>
            <Stack vertical={32}>
              <Stack vertical={12}>
                <Typography size={16} lineHeight="small" mix>
                  <Link to="post-list">← Posts</Link>
                </Typography>
                {post?.title ? (
                  <Typography size={32} weight="semi-bold" lineHeight="small">
                    {post.title}
                  </Typography>
                ) : (
                  <SkeletonTypography size={32} weight="semi-bold" lineHeight="small" minLength={5} maxLength={9} />
                )}
                {post?.body ? (
                  <Typography size={16}>{post.body}</Typography>
                ) : (
                  <SkeletonTypography size={16} minLength={400} maxLength={600} />
                )}
              </Stack>
            </Stack>
          </Fragment>
        }
      />
    </Fragment>
  )
}

export { Post }
