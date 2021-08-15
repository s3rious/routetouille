import * as React from 'react'
import { useMemo, useCallback, ReactNode, HTMLProps, ReactElement, MouseEventHandler } from 'react'
import classNames from 'classnames/dedupe'

import { useRouter, Activator, Params, RouterInterface } from 'services/router'

import styles from './Link.module.css'

type LinkProps = {
  children: ReactNode
  className?: string
  to?: Activator
  params?: Params
  optimistic?: boolean
} & HTMLProps<HTMLAnchorElement>

function Link({ children, className, to, params, optimistic = true, ...rest }: LinkProps): ReactElement {
  const router: RouterInterface | undefined = useRouter()

  const href: string | undefined = useMemo(() => {
    if (to != null && router != null) {
      return router.urlTo(to, params) ?? undefined
    }

    return rest.href
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

  return (
    <a className={classNames(className, styles.Link)} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

export { Link, LinkProps }
