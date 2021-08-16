import * as React from 'react'
import { ReactNode, HTMLProps, ReactElement } from 'react'
import classNames from 'classnames/dedupe'

import { useLink, Activator, Params } from 'services/router'

import styles from './Link.module.css'

type LinkProps = {
  children: ReactNode
  className?: string
  to?: Activator
  params?: Params
  optimistic?: boolean
} & HTMLProps<HTMLAnchorElement>

function Link({
  children,
  className,
  to,
  params,
  optimistic = true,
  href: hrefProps,
  ...rest
}: LinkProps): ReactElement {
  const { href, handleClick } = useLink({ to, params, optimistic, href: hrefProps })

  return (
    <a className={classNames(className, styles.Link)} href={href} onClick={handleClick} {...rest}>
      {children}
    </a>
  )
}

export { Link, LinkProps }
