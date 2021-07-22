import * as React from 'react'
import { useMemo, useCallback, ReactNode, HTMLProps, ReactElement, MouseEventHandler } from 'react'

import { useRouter, Activator, Params, RouterInterface } from 'router/index'

type LinkProps = {
  children: ReactNode
  to: Activator
  params?: Params
  optimistic?: boolean
} & HTMLProps<HTMLAnchorElement>

function Link({ children, to, params, optimistic = true, ...rest }: LinkProps): ReactElement {
  const router: RouterInterface | undefined = useRouter()

  const href: string | undefined = useMemo(() => {
    if (Boolean(router)) {
      return router.urlTo(to, params) ?? undefined
    }

    return undefined
  }, [to, params, router])

  const handleClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
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
