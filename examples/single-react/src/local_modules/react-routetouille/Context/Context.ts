import { createContext, Context as ReactContext } from 'react'
import { RouterInterface } from 'routetouille'

const Context: ReactContext<{ router: RouterInterface | undefined }> = createContext({ router: undefined })
Context.displayName = 'ReactRoutetouilleContext'

export { Context }
