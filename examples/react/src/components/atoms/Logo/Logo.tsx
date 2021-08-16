import * as React from 'react'
import { ReactElement } from 'react'

import { Typography } from 'components/atoms/Typography'

function Logo(): ReactElement {
  return (
    <Typography size={20} weight="light">
      ⚛ Routetouille
    </Typography>
  )
}

export { Logo }
