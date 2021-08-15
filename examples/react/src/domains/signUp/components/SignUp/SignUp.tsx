import * as React from 'react'
import { ReactElement, useCallback, useEffect, useMemo, useState } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'services/router/routes'
import { effects as clientEffects } from 'domains/client'

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
  const loading = useStore(clientEffects.signUp.pending)
  const [error, setError] = useState<Error | null>(null)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const disabled = useMemo<boolean>(() => email.length <= 0 || password.length <= 0, [email, password])

  useEffect(() => {
    console.error(error)
  }, [error])

  const handleEmail = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setEmail(event.target.value)
      }
    },
    [setEmail],
  )

  const handlePassword = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setPassword(event.target.value)
      }
    },
    [setPassword],
  )

  const handleSignUp = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      try {
        await clientEffects.signUp({ email, password })
        await router.goTo('auth.dashboard', { optimistic: true })
      } catch (error) {
        setError(error)
      }
    },
    [router, error, email, password],
  )

  return (
    <Relative mix>
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
        <Preloader shown={loading} />
      </Card>
    </Relative>
  )
}

export { SignUp }
