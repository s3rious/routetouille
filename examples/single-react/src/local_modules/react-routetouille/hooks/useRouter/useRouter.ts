import { useContext } from 'react'
import { Context, ContextValue } from '../../Context'
import { RouterInterface } from 'routetouille'

function useRouter(): RouterInterface | undefined {
  const { router } = useContext<ContextValue>(Context)

  return router
}

export { useRouter }
