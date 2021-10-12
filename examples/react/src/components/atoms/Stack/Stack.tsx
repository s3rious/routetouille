import * as React from 'react'
import { ReactElement, ReactNode, ReactNodeArray } from 'react'
import classNames from 'classnames/dedupe'

import { Spacing, SpacingSize } from 'components/atoms/Spacing'

import styles from './Stack.module.css'

type StackAligns = 'stretch' | 'start' | 'center' | 'end' | 'baseline'

type GeneralStackProps = {
  children?: ReactNode | ReactNodeArray
  className?: string
  align?: StackAligns
  inline?: boolean
}

type VerticalStackProps = {
  vertical: SpacingSize
} & GeneralStackProps

type HorizontalStackProps = {
  horizontal: SpacingSize
} & GeneralStackProps

type StackProps = XOR<VerticalStackProps, HorizontalStackProps>

function Stack({
  children,
  className,
  vertical,
  horizontal,
  align = 'stretch',
  inline = false,
}: StackProps): ReactElement {
  const classes = classNames(className, styles.Stack, {
    [styles.Stack_vertical]: vertical,
    [styles.Stack_horizontal]: horizontal,
    [styles[`Stack_align_${align}`]]: align,
    [styles.Stack_inline]: inline,
  })

  return (
    <div className={classes}>
      {React.Children.toArray(children)
        .filter((child) => Boolean(child))
        .map((child, index) => {
          const isFirst = index === 0

          if (isFirst) {
            return child
          }

          if (vertical) {
            return (
              <Spacing key={index} top={vertical}>
                {child}
              </Spacing>
            )
          }

          return (
            <Spacing key={index} left={horizontal}>
              {child}
            </Spacing>
          )
        })}
    </div>
  )
}

export { Stack }
