import { useContext } from 'react'
import { RouterInterface } from 'routetouille'

import { Context, ContextValue } from '../Context/index.js'

function useRouter(): RouterInterface | undefined {
  const context = useContext<ContextValue>(Context)
  
  if (!context) {
    return undefined
  }

  const { router } = context
  return router
}

export { useRouter }
