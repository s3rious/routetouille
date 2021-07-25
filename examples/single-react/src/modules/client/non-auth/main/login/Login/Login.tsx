import * as React from 'react'
import { ReactElement } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'router/routes'
import { effects as clientEffects } from 'modules/client/index'

import { Link } from 'components/atoms/Link'

function Login({ router }: WithReactComponentProps): ReactElement {
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
    <>
      <button onClick={handleLogin}>Login</button>
      <Link to="main.sign-up">Sign up</Link>
    </>
  )
}

export { Login }
