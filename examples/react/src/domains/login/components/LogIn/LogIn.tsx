import * as React from 'react'
import { ReactElement, useCallback, useMemo, useState } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'services/router/routes'
import { effects as clientEffects } from 'domains/client'

import { Relative } from 'components/atoms/Relative'
import { Card } from 'components/atoms/Card/Card'
import { Stack } from 'components/atoms/Stack'
import { Spacing } from 'components/atoms/Spacing'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'
import { Input } from 'components/atoms/Input'
import { RegularButton } from 'components/molecules/RegularButton'
import { Preloader } from 'components/atoms/Preloader'

function LogIn({ router }: WithReactComponentProps): ReactElement {
  const lastActiveRouteName: string | null = router.active[router.active.length - 1].name ?? null
  const loading = useStore(clientEffects.logIn.pending)

  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const disabled = useMemo<boolean>(() => email.length <= 0 || password.length <= 0, [email, password])

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

  const handleLogin = useCallback(
    async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
      event.preventDefault()

      try {
        await clientEffects.logIn({ email, password })
        await router.goTo('auth.dashboard', { optimistic: true })
      } catch (error) {
        console.log(clientEffects.logIn.fail)
      }
    },
    [router, email, password],
  )

  return (
    <Relative mix>
      <Card level={3}>
        <Spacing vertical={40} horizontal={80}>
          <Typography size={32} align="center">
            Log in
          </Typography>
          <Spacing top={16} mix>
            <form onSubmit={handleLogin}>
              <Stack vertical={24}>
                {lastActiveRouteName === 'reset-success' && (
                  <Card color="secondary" level={0}>
                    <Spacing vertical={8} horizontal={16}>
                      <Typography size={14} color="on-color-default">
                        Password reset instructions sent to your email address
                      </Typography>
                    </Spacing>
                  </Card>
                )}
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
                <Link to="login.forgot-password">
                  <Typography size={12}>Forgot password?</Typography>
                </Link>
                <RegularButton type="submit" disabled={disabled || loading} block>
                  {loading ? 'Logging in...' : 'Log in'}
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

export { LogIn }
