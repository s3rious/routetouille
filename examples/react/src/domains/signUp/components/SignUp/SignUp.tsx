import * as React from 'react'
import { ReactElement } from 'react'

import { WithReactComponentProps } from 'services/router/routes'

import { useSignUp } from 'domains/signUp/hooks/useSignUp'

import { Relative } from 'components/atoms/Relative'
import { Card } from 'components/atoms/Card/Card'
import { Stack } from 'components/atoms/Stack'
import { Spacing } from 'components/atoms/Spacing'
import { Typography } from 'components/atoms/Typography'
import { Toast } from 'components/molecules/Toast'
import { Input } from 'components/atoms/Input'
import { RegularButton } from 'components/molecules/RegularButton'
import { Preloader } from 'components/atoms/Preloader'

function SignUp({ router }: WithReactComponentProps): ReactElement {
  const { loading, email, password, error, disabled, handleEmail, handlePassword, handleSignUp } = useSignUp(router)

  return (
    <Relative mix>
      <Preloader shown={loading} />
      <Card level={3}>
        <Spacing vertical={40} horizontal={80}>
          <Typography size={32} align="center">
            Sign up
          </Typography>
          <Spacing top={16} mix>
            <form onSubmit={handleSignUp}>
              <Stack vertical={24}>
                {error?.message && <Toast status="error">{error?.message}</Toast>}
                <label>
                  <Stack vertical={4}>
                    <Typography size={12}>Your email</Typography>
                    <Input type="email" autoComplete="username" onChange={handleEmail} block>
                      {email}
                    </Input>
                  </Stack>
                </label>
                <label>
                  <Stack vertical={4}>
                    <Typography size={12}>Password</Typography>
                    <Input type="password" autoComplete="current-password" onChange={handlePassword} block>
                      {password}
                    </Input>
                  </Stack>
                </label>
                <RegularButton type="submit" disabled={disabled || loading} block>
                  {loading ? 'Signing up...' : 'Sign up'}
                </RegularButton>
              </Stack>
            </form>
          </Spacing>
        </Spacing>
      </Card>
    </Relative>
  )
}

export { SignUp }
