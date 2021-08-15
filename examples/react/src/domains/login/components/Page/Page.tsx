import * as React from 'react'
import { ReactElement } from 'react'

import { WithReactComponentProps } from 'services/router/routes'

import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { RegularButton } from 'components/molecules/RegularButton'

import { NonAuthLayout } from 'domains/client/domains/non-auth/components/NonAuthLayout'

import { LogIn } from '../LogIn'

function Page({ router, route, children }: WithReactComponentProps): ReactElement {
  return (
    <NonAuthLayout
      headerRight={
        <Stack horizontal={20} align="center" inline>
          <Typography size={14} color="minor">
            Don’t have an account?
          </Typography>
          <RegularButton to="non-auth.sign-up" theme="secondary" size="small" block>
            Sign up
          </RegularButton>
        </Stack>
      }
      content={children ?? <LogIn router={router} route={route} />}
    />
  )
}

export { Page }
