import * as React from 'react'
import { useCallback, useMemo, useState } from 'react'
import { useStore } from 'effector-react'

import { RouterInterface } from 'services/router'
import { effects as clientEffects } from 'domains/client'

type UseSignUpInterface = {
  loading: boolean
  email: string
  password: string
  error: Error | null
  disabled: boolean
  handleEmail: (event: React.FormEvent<HTMLInputElement>) => void
  handlePassword: (event: React.FormEvent<HTMLInputElement>) => void
  handleSignUp: (event: React.FormEvent<HTMLFormElement>) => Promise<void>
}

function useSignUp(router: RouterInterface): UseSignUpInterface {
  const loading = useStore(clientEffects.signUp.pending)
  const [error, setError] = useState<Error | null>(null)

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

  return {
    loading,
    email,
    password,
    error,
    disabled,
    handleEmail,
    handlePassword,
    handleSignUp,
  }
}

export { useSignUp }
