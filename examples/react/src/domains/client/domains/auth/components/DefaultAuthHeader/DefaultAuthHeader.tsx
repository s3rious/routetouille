import * as React from 'react'
import { ReactElement } from 'react'
import { useStore } from 'effector-react'

import { $client } from 'domains/client'

import { Header } from 'components/molecules/Header'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { RegularButton } from 'components/molecules/RegularButton'

function DefaultAuthHeader(): ReactElement {
  const client = useStore($client)

  return (
    <Header
      right={
        client.isLoaded() && (
          <Stack horizontal={20} align="center" inline>
            <Typography size={14} color="minor">
              Hello, {client.fullName}
            </Typography>
            <RegularButton to="logout" theme="outline" size="small" block>
              Log out
            </RegularButton>
          </Stack>
        )
      }
    />
  )
}

export { DefaultAuthHeader }
