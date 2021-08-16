import * as React from 'react'
import { ReactElement } from 'react'

import { Layout } from 'components/atoms/Layout'
import { AllCenter } from 'components/atoms/AllCenter'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'

function Fallback(): ReactElement {
  return (
    <Layout
      content={
        <AllCenter>
          <Stack vertical={4}>
            <Typography size={128} lineHeight="small" weight="black" align="center">
              404
            </Typography>
            <Typography size={20} lineHeight="small" align="center">
              These aren't the page you're looking for...
            </Typography>
          </Stack>
        </AllCenter>
      }
    />
  )
}

export { Fallback }
