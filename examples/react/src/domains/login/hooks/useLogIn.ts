import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useStore } from 'effector-react'

import { RouterInterface } from 'services/router'
import { effects as clientEffects } from 'domains/client'

type UseLogInInterface = {
  loading: boolean
  email: string
  password: string
  disabled: boolean
  handleEmail: (event: React.FormEvent<HTMLInputElement>) => void
  handlePassword: (event: React.FormEvent<HTMLInputElement>) => void
  handleLogin: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

function useLogIn(router: RouterInterface): UseLogInInterface {
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

  return {
    loading,
    email,
    password,
    disabled,
    handleEmail,
    handlePassword,
    handleLogin,
  }
}

export { useLogIn }
