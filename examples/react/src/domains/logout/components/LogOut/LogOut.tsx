import * as React from 'react'
import { ReactElement } from 'react'

import { Preloader } from 'components/atoms/Preloader'

function LogOut(): ReactElement {
  return <Preloader shown />
}

export { LogOut }
