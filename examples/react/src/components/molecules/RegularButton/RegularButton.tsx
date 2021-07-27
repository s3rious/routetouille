import * as React from 'react'
import { ReactElement } from 'react'

import { Activator } from 'router/index'

import { Button, ButtonProps } from 'components/atoms/Button'
import { Spacing, SpacingSize } from 'components/atoms/Spacing'
import { Typography, TypographySize } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'

type RegularButtonSize = 'small' | 'default'

type RegularButtonProps = {
  size?: RegularButtonSize
  to?: Activator
} & Omit<ButtonProps, 'size'>

function RegularButton({ size = 'default', to, ...rest }: RegularButtonProps): ReactElement {
  type RegularButtonMetrics = {
    vertical: SpacingSize
    horizontal: SpacingSize
    typography: TypographySize
  }

  const metrics: RegularButtonMetrics = {
    small: {
      vertical: 8 as SpacingSize,
      horizontal: 16 as SpacingSize,
      typography: 14 as TypographySize,
    },
    default: {
      vertical: 12 as SpacingSize,
      horizontal: 24 as SpacingSize,
      typography: 16 as TypographySize,
    },
  }[size]

  const button = (
    <Typography size={metrics.typography} lineHeight="small" align="center" mix>
      <Spacing vertical={metrics.vertical} horizontal={metrics.horizontal} mix>
        <Button {...rest} />
      </Spacing>
    </Typography>
  )

  if (to != null) {
    return (
      <Link to={to} tabIndex={-1}>
        {button}
      </Link>
    )
  }

  return button
}

export { RegularButton, RegularButtonSize }
