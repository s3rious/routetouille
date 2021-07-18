import * as React from 'react'
import { Activator, Params, RouterInterface } from 'routetouille'

import { RootContext } from 'modules/root/Root'

type LinkProps = {
  children: React.ReactNode
  to: Activator
  params?: Params
  optimistic?: boolean
} & React.HTMLProps<HTMLAnchorElement>

function Link({ children, to, params, optimistic = true, ...rest }: LinkProps): React.ReactElement {
  const router: RouterInterface | undefined = React.useContext(RootContext).router

  const href: string | undefined = React.useMemo(() => {
    if (Boolean(router)) {
      return router.urlTo(to, params) ?? undefined
    }

    return undefined
  }, [to, params, router])

  const handleClick: React.MouseEventHandler<HTMLAnchorElement> = React.useCallback(
    async (event) => {
      if (Boolean(router)) {
        event.preventDefault()

        await router.goTo(to, { params, optimistic })
      }
    },
    [to, params, optimistic, router],
  )

  return (
    <a href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

export { Link }
