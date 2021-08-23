import * as React from 'react'
import { ReactElement, ReactHTML, ReactNode } from 'react'
import classNames from 'classnames/dedupe'

import styles from './Typography.module.css'

type TypographyTag = keyof ReactHTML
type TypographyColor =
  | 'inherit'
  | 'default'
  | 'additional'
  | 'minor'
  | 'muted'
  | 'on-color-default'
  | 'warning'
  | 'error'
type TypographySize = 10 | 12 | 14 | 16 | 18 | 20 | 24 | 32 | 48 | 54 | 64 | 128
type TypographyWeight =
  | 'thin'
  | 'extra-light'
  | 'light'
  | 'regular'
  | 'medium'
  | 'semi-bold'
  | 'bold'
  | 'extra-bold'
  | 'black'
type TypographyLineHeight = 'small' | 'medium'
type TypographyAligns = 'left' | 'center' | 'right'
type TypographyNumerics = 'tabular'
type TypographyWordBreaks = 'break-all'

type TypographyProps = {
  children?: ReactNode
  tag?: TypographyTag
  className?: string
  color?: TypographyColor
  size?: TypographySize
  weight?: TypographyWeight
  lineHeight?: TypographyLineHeight
  align?: TypographyAligns
  numeric?: TypographyNumerics
  wordBreak?: TypographyWordBreaks
  mix?: boolean
}

function Typography({
  children,
  tag = 'div',
  className,
  color = 'inherit',
  size = 16,
  weight = 'regular',
  lineHeight = 'medium',
  align = 'left',
  numeric,
  wordBreak,
  mix = false,
}: TypographyProps): ReactElement | null {
  /* eslint-disable @typescript-eslint/restrict-template-expressions */
  const classes = classNames(className, styles.Typography, {
    [styles[`Typography_color_${color}`]]: color,
    [styles[`Typography_size_${size}`]]: size,
    [styles[`Typography_weight_${weight}`]]: weight,
    [styles[`Typography_lineHeight_${lineHeight}`]]: lineHeight,
    [styles[`Typography_align_${align}`]]: align,
    [styles[`Typography_numeric_${numeric}`]]: numeric,
    [styles[`Typography_wordBreak_${wordBreak}`]]: wordBreak,
  })
  /* eslint-enable @typescript-eslint/restrict-template-expressions */

  if (mix && React.isValidElement(children)) {
    return React.cloneElement(children, { className: classes })
  }

  if (Boolean(children)) {
    return React.createElement(tag, { className: classes }, children)
  }

  return null
}

export {
  Typography,
  TypographyProps,
  TypographyTag,
  TypographyColor,
  TypographySize,
  TypographyWeight,
  TypographyLineHeight,
  TypographyAligns,
  TypographyNumerics,
}
