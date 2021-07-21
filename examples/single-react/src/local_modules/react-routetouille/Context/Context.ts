import { createContext, Context as ReactContext } from 'react'
import { RouterInterface } from 'routetouille'

type ContextValue = { router: RouterInterface | undefined }

const Context: ReactContext<ContextValue> = createContext<ContextValue>({ router: undefined })
Context.displayName = 'ReactRoutetouilleContext'

export { Context }
