import * as React from 'react'
import { Fragment, ReactElement } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'services/router/routes'
import { $client, $isClientLoading, effects as clientEffects } from 'domains/client'

function Dashboard({ router }: WithReactComponentProps): ReactElement {
  const client = useStore($client)
  const loading = useStore($isClientLoading)

  const handleLogout = async (): Promise<void> => {
    try {
      await clientEffects.logOut()
      await router.goTo('non-auth', { optimistic: true })
    } catch (error) {
      console.log(clientEffects.logOut.fail)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <Fragment>
      {JSON.stringify(client)}
      <button onClick={handleLogout}>Logout</button>
    </Fragment>
  )
}

export { Dashboard }
