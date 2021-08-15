import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import { Layout } from 'components/atoms/Layout'
import { Inner } from 'components/atoms/Inner'
import { Header } from 'components/molecules/Header'
import { AllCenter } from 'components/atoms/AllCenter'
import { Width } from 'components/atoms/Width'
import { Footer } from 'components/molecules/Footer'

import { Background } from '../Background'

type NonAuthLayoutProps = {
  headerRight: ReactNode
  content: ReactNode
}

function NonAuthLayout({ headerRight, content }: NonAuthLayoutProps): ReactElement {
  return (
    <Layout
      header={<Header right={headerRight} />}
      content={
        <Background>
          <Inner fullHeight>
            <AllCenter>
              <Width size={448}>{content}</Width>
            </AllCenter>
          </Inner>
        </Background>
      }
      footer={<Footer />}
    />
  )
}

export { NonAuthLayout }
