import * as React from 'react'
import { ReactElement, ReactNode } from 'react'

import { Inner } from 'components/atoms/Inner'
import { Spacing } from 'components/atoms/Spacing'
import { Stack } from 'components/atoms/Stack'
import { Typography } from 'components/atoms/Typography'
import { Link } from 'components/atoms/Link'

import styles from './Footer.module.css'

type FooterProps = {
  children?: ReactNode
}

function Footer({ children }: FooterProps): ReactElement {
  return (
    <Stack className={styles.Footer} vertical={20}>
      <Spacing className={styles.FooterTopBar} vertical={12}>
        <Inner>
          <Stack horizontal={16}>
            <Link href="mailto:support@example.com">support@example.com</Link>
            <Link href="tel:+442920180123">+44 29 2018 0123</Link>
          </Stack>
        </Inner>
      </Spacing>
      {Boolean(children) && <Inner className={styles.FooterContent}>{children}</Inner>}
      <Spacing className={styles.FooterCopyright} bottom={16}>
        <Inner>
          <Typography size={14} align="center" color="muted">
            © Routetouille Megacorp 2021. All rights reserved.
          </Typography>
        </Inner>
      </Spacing>
    </Stack>
  )
}

export { Footer, FooterProps }
