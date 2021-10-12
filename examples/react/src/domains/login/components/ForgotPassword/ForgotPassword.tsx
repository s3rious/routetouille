import * as React from 'react'
import { ReactElement, useCallback, useMemo, useState } from 'react'

import { WithReactComponentProps } from 'services/router/routes'

import { Card } from 'components/atoms/Card/Card'
import { Stack } from 'components/atoms/Stack'
import { Spacing } from 'components/atoms/Spacing'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'
import { Input } from 'components/atoms/Input'
import { RegularButton } from 'components/molecules/RegularButton'

function ForgotPassword({ router }: WithReactComponentProps): ReactElement {
  const [email, setEmail] = useState<string>('')
  const disabled = useMemo<boolean>(() => email.length <= 0, [email])

  const handleEmail = useCallback(
    (event: React.FormEvent<HTMLInputElement>): void => {
      if (event.target instanceof HTMLInputElement) {
        setEmail(event.target.value)
      }
    },
    [setEmail],
  )

  const handleReset = useCallback(
    async (): Promise<void> => await router.goTo('login.reset-success', { optimistic: true }),
    [router],
  )

  return (
    <Card level={3}>
      <Spacing vertical={40} horizontal={80}>
        <Typography size={32} align="center">
          Forgot password
        </Typography>
        <Spacing top={16} mix>
          <form onSubmit={handleReset}>
            <Stack vertical={24}>
              <label>
                <Stack vertical={4}>
                  <Typography size={12}>Your email</Typography>
                  <Input type="email" onChange={handleEmail} block>
                    {email}
                  </Input>
                </Stack>
              </label>
              <Link to="login">
                <Typography size={12}>Back to log in</Typography>
              </Link>
              <RegularButton type="submit" disabled={disabled} block>
                Send reset email
              </RegularButton>
            </Stack>
          </form>
        </Spacing>
      </Spacing>
    </Card>
  )
}

export { ForgotPassword }
