import * as React from 'react'

import { WithReactComponentProps } from 'router/routes'

import { Link } from 'components/atoms/Link'

function Login({ router }: WithReactComponentProps): React.ReactElement {
  return (
    <>
      <div>Login</div>
      <Link to="main.sign-up">Sign up</Link>
    </>
  )
}

export { Login }
