import * as React from 'react'
import { Fragment, ReactElement, ReactNode } from 'react'
import { useStore } from 'effector-react'

import { $isClientLoading } from 'domains/client'

import { Layout } from 'components/atoms/Layout'
import { Inner } from 'components/atoms/Inner'
import { Spacing } from 'components/atoms/Spacing'
import { Footer } from 'components/molecules/Footer'
import { Preloader } from 'components/atoms/Preloader'

import { DefaultAuthHeader } from '../DefaultAuthHeader'

type AuthLayoutProps = {
  header?: ReactNode
  content: ReactNode
  footer?: ReactNode
}

function AuthLayout({ header = <DefaultAuthHeader />, content, footer = <Footer /> }: AuthLayoutProps): ReactElement {
  const loading = useStore($isClientLoading)

  return (
    <Fragment>
      <Preloader shown={loading} />
      <Layout
        header={header}
        content={
          <Inner fullHeight>
            <Spacing top={40} bottom={120}>
              {content}
            </Spacing>
          </Inner>
        }
        footer={footer}
      />
    </Fragment>
  )
}

export { AuthLayout }
