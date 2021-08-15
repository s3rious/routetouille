import * as React from 'react'
import { ReactElement, ReactNode } from 'react'
import classNames from 'classnames/dedupe'

import { Card } from 'components/atoms/Card/Card'
import { Spacing } from 'components/atoms/Spacing'
import { Typography } from 'components/atoms/Typography'

import styles from './Toast.module.css'

type ToastProps = {
  children: ReactNode
  className?: string
  status: 'error' | 'success'
}

const Toast = ({ children, className, status }: ToastProps): ReactElement => {
  return (
    <Card className={classNames(className, styles.Toast, { [styles[`Toast_status_${status}`]]: status })} level={0}>
      <Spacing vertical={8} horizontal={16}>
        <Typography size={14} color="on-color-default">
          {children}
        </Typography>
      </Spacing>
    </Card>
  )
}

export { Toast }
