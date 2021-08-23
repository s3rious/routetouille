import * as React from 'react'
import { Fragment, ReactElement } from 'react'
import { useStore } from 'effector-react'

import { $client, $accessToken } from 'domains/client'

import { Header } from 'components/molecules/Header'
import { Stack } from 'components/atoms/Stack'
import { SkeletonTypography } from 'components/molecules/SkeletonTypography'
import { Typography } from 'components/atoms/Typography'
import { Skeleton } from 'components/atoms/Skeleton'
import { RegularButton } from 'components/molecules/RegularButton'

function DefaultAuthHeader(): ReactElement {
  const client = useStore($client)
  const accessToken = useStore($accessToken)

  return (
    <Header
      right={
        <Stack horizontal={20} align="center" inline>
          <Typography size={14} color="minor">
            Hello,{' '}
            {client.fullName ? (
              client.fullName
            ) : (
              <Fragment>
                <SkeletonTypography tag="span" length={3} />
                {'\u2002'}
                <SkeletonTypography tag="span" length={4} />
              </Fragment>
            )}
          </Typography>
          <Skeleton shown={!accessToken}>
            <RegularButton to="logout" theme="outline" size="small" block>
              Log out
            </RegularButton>
          </Skeleton>
        </Stack>
      }
    />
  )
}

export { DefaultAuthHeader }
