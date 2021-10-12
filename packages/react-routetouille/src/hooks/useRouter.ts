import { useContext } from 'react'
import { RouterInterface } from 'routetouille'

import { Context, ContextValue } from '../Context'

function useRouter(): RouterInterface | undefined {
  const { router } = useContext<ContextValue>(Context)

  return router
}

export { useRouter }
