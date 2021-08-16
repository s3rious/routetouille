import * as React from 'react'
import { Fragment, ReactElement } from 'react'
import { useStore } from 'effector-react'

import { $client } from 'domains/client'

import { AuthLayout } from 'domains/client/domains/auth/components/AuthLayout'

function Dashboard(): ReactElement {
  const client = useStore($client)

  return <AuthLayout content={<Fragment>{JSON.stringify(client)}</Fragment>} />
}

export { Dashboard }
