import * as React from 'react'

import { WithReactComponentProps } from '../../../../routes/WithReactComponent'

function Login({ router }: WithReactComponentProps): React.ReactElement {
  return (
    <>
      <div>Login</div>
      <a onClick={async () => await router.goTo('main.sign-up')}>Sign up</a>
    </>
  )
}

export { Login }
