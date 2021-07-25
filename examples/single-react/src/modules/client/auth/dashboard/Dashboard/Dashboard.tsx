import * as React from 'react'
import { ReactElement } from 'react'
import { useStore } from 'effector-react'

import { WithReactComponentProps } from 'router/routes'
import { effects as clientEffects } from 'modules/client/index'

function Dashboard({ router }: WithReactComponentProps): ReactElement {
  const loading = useStore(clientEffects.logOutFx.pending)

  const handleLogout = async (): Promise<void> => {
    try {
      await clientEffects.logOutFx()
      await router.goTo('non-auth.main', { optimistic: true })
    } catch (error) {
      console.log(clientEffects.logOutFx.fail)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <>
      <button onClick={handleLogout}>Logout</button>
    </>
  )
}

export { Dashboard }
