import { useCallback, useMemo, MouseEventHandler } from 'react'
import { Activator, Params, RouterInterface } from 'routetouille'

import { useRouter } from './useRouter'

type UseLinkProps<LinkActivator, LinkParams> = {
  to?: LinkActivator
  params?: LinkParams
  optimistic?: boolean
  href?: string
}

type UseLink = {
  href: string | undefined
  handleClick: MouseEventHandler<HTMLAnchorElement>
}

function useLink<LinkActivator extends Activator, LinkParams extends Params>({
  to,
  params,
  optimistic,
  href: hrefProp,
}: UseLinkProps<LinkActivator, LinkParams>): UseLink {
  const router: RouterInterface | undefined = useRouter()

  const href: string | undefined = useMemo(() => {
    if (to != null && router != null) {
      return router.urlTo(to, params) ?? hrefProp
    }

    return hrefProp
  }, [to, params, router])

  const handleClick: MouseEventHandler<HTMLAnchorElement> = useCallback(
    async (event) => {
      if (to != null && router != null) {
        event.preventDefault()

        await router.goTo(to, { params, optimistic })
      }
    },
    [to, params, optimistic, router],
  )

  return {
    href,
    handleClick,
  }
}

export { useLink }
