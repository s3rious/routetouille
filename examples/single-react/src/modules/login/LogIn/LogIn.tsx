import * as React from 'react'
import { ReactElement } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'router/routes'
import { effects as clientEffects } from 'modules/client'

import { Layout } from 'components/atoms/Layout'
import { Inner } from 'components/atoms/Inner'
import { Link } from 'components/atoms/Link'
import { Header } from 'components/molecules/Header/Header'

function LogIn({ router }: WithReactComponentProps): ReactElement {
  const loading = useStore(clientEffects.logInFx.pending)

  const handleLogin = async (): Promise<void> => {
    try {
      await clientEffects.logInFx({ email: 'email', password: 'password' })
      await router.goTo('auth.dashboard', { optimistic: true })
    } catch (error) {
      console.log(clientEffects.logInFx.fail)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Layout
      header={<Header right={<Link to="non-auth.sign-up">Sign up</Link>} />}
      content={
        <Inner>
          <button onClick={handleLogin}>Login</button>
        </Inner>
      }
    />
  )
}

export { LogIn }
