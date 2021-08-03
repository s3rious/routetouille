import * as React from 'react'
import { HTMLProps, ReactElement } from 'react'
import classNames from 'classnames/dedupe'

import styles from './Input.module.css'
import { Spacing } from '../Spacing'
import { Typography } from '../Typography'

type InputProps = {
  children?: string | readonly string[] | number
  className?: string
  disabled?: boolean
  block?: boolean
} & HTMLProps<HTMLInputElement>

function Input({ children, className, disabled, block, ...rest }: InputProps): ReactElement {
  const classes = classNames(className, styles.Input, {
    [styles.Input_block]: block,
    [styles.Input_disabled]: disabled,
  })

  return (
    <Typography className={classes} size={16} lineHeight="small" color="default" mix>
      <Spacing vertical={8} horizontal={12} mix>
        <input value={children} disabled={disabled} {...rest} />
      </Spacing>
    </Typography>
  )
}

export { Input }
