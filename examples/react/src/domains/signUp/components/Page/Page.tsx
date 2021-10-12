import * as React from 'react'
import { ReactElement } from 'react'
import { WithReactComponentProps } from 'react-routetouille'

import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { RegularButton } from 'components/molecules/RegularButton'

import { NonAuthLayout } from 'domains/client/domains/non-auth/components/NonAuthLayout'

import { SignUp } from '../SignUp'

function Page({ router, route }: WithReactComponentProps): ReactElement {
  return (
    <NonAuthLayout
      headerRight={
        <Stack horizontal={20} align="center" inline>
          <Typography size={14} color="minor">
            Have an account?
          </Typography>
          <RegularButton to="non-auth.login" theme="secondary" size="small" block>
            Log in
          </RegularButton>
        </Stack>
      }
      content={<SignUp router={router} route={route} />}
    />
  )
}

export { Page }
