import * as React from 'react'
import { ReactElement } from 'react'
import { WithReactComponentProps } from 'local_modules/react-routetouille'

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
import { SignUp } from '../SignUp'

function Page({ router, route }: WithReactComponentProps): ReactElement {
  return (
    <Layout
      header={
        <Header
          right={
            <Stack horizontal={20} align="center" inline>
              <Typography size={14} color="minor">
                Have an account?
              </Typography>
              <RegularButton to="non-auth.login" theme="secondary" size="small" block>
                Log in
              </RegularButton>
            </Stack>
          }
        />
      }
      content={
        <Background>
          <Inner fullHeight>
            <AllCenter>
              <Width size={448}>
                <SignUp router={router} route={route} />
              </Width>
            </AllCenter>
          </Inner>
        </Background>
      }
      footer={<Footer />}
    />
  )
}

export { Page }
