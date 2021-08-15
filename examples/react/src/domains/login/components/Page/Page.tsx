import * as React from 'react'
import { ReactElement } from 'react'

import { WithReactComponentProps } from 'services/router/routes'

import { Layout } from 'components/atoms/Layout'
import { Inner } from 'components/atoms/Inner'
import { Header } from 'components/molecules/Header'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { RegularButton } from 'components/molecules/RegularButton'
import { AllCenter } from 'components/atoms/AllCenter'
import { Width } from 'components/atoms/Width'
import { Footer } from 'components/molecules/Footer'

import { Background } from '../Background'
import { LogIn } from '../LogIn'

function Page({ router, route, children }: WithReactComponentProps): ReactElement {
  return (
    <Layout
      header={
        <Header
          right={
            <Stack horizontal={20} align="center" inline>
              <Typography size={14} color="minor">
                Don’t have an account?
              </Typography>
              <RegularButton to="non-auth.sign-up" theme="secondary" size="small" block>
                Sign up
              </RegularButton>
            </Stack>
          }
        />
      }
      content={
        <Background>
          <Inner fullHeight>
            <AllCenter>
              <Width size={448}>{children ?? <LogIn router={router} route={route} />}</Width>
            </AllCenter>
          </Inner>
        </Background>
      }
      footer={<Footer />}
    />
  )
}

export { Page }
