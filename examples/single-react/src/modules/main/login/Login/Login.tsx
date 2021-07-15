import * as React from 'react'

import { ComponentProps } from '../../../../routes/WithReactComponent'

function Login({ router }: ComponentProps): React.ReactElement {
  return (
    <>
      <div>Login</div>
      <a onClick={async () => await router.goTo('main.sign-up')}>Sign up</a>
    </>
  )
}

export { Login }
