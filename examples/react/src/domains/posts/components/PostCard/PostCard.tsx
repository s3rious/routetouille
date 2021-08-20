import * as React from 'react'
import { ReactElement } from 'react'

import { PostModel } from 'domains/posts'

import { Link } from 'components/atoms/Link'
import { Card } from 'components/atoms/Card/Card'
import { Spacing } from 'components/atoms/Spacing'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { SkeletonTypography } from 'components/molecules/SkeletonTypography'

type PostCardProps = {
  post: Partial<PostModel>
  skeleton?: boolean
}

function PostCard({ post, skeleton = false }: PostCardProps): ReactElement {
  return (
    <Link
      to="post"
      params={post.id ? [{ id: post.id.toString() }] : undefined}
      style={skeleton ? { pointerEvents: 'none' } : undefined}
    >
      <Card>
        <Spacing vertical={24} horizontal={32} mix>
          <Stack vertical={12}>
            {skeleton ? (
              <SkeletonTypography size={20} lineHeight="small" weight="semi-bold" minLength={5} maxLength={9} />
            ) : (
              <Typography size={20} lineHeight="small" weight="semi-bold">
                {post.title}
              </Typography>
            )}
            {skeleton ? (
              <SkeletonTypography size={16} color="additional" minLength={35} maxLength={50} />
            ) : (
              <Typography size={16} color="additional">
                {post.hook}
              </Typography>
            )}
          </Stack>
        </Spacing>
      </Card>
    </Link>
  )
}

export { PostCard }
