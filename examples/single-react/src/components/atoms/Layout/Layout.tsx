import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import styles from './Layout.module.css'

type LayoutProps = {
  header?: ReactNode
  content?: ReactNode
  footer?: ReactNode
}

function Layout({ header, content, footer }: LayoutProps): ReactElement {
  return (
    <div className={styles.Layout}>
      {header ?? <div />}
      {content ?? <div />}
      {footer ?? <div />}
    </div>
  )
}

export { Layout, LayoutProps }
