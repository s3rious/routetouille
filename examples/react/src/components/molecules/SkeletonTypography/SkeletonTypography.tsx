import * as React from 'react'
import { ReactElement, useEffect, useMemo, useState } from 'react'

import { Typography, TypographyProps } from 'components/atoms/Typography'
import { Skeleton } from '../../atoms/Skeleton'

type SkeletonTypographyProps = {
  minLength: number
  maxLength: number
} & TypographyProps

function SkeletonTypography({
  minLength,
  maxLength,
  ...typographyProps
}: SkeletonTypographyProps): ReactElement | null {
  const [length, setLength] = useState<number | null>(null)
  const text: string = useMemo(() => {
    if (length) {
      return Array.from({ length })
        .map((_) => '█')
        .join('')
    }

    return ''
  }, [length])

  useEffect(() => {
    const random: number = Math.random()
    const size: number = parseInt((random * (maxLength - minLength) + minLength).toFixed(), 10)

    setLength(size)
  }, [minLength, maxLength, setLength])

  if (length) {
    return (
      <Skeleton mix>
        <Typography {...typographyProps}>{text}</Typography>
      </Skeleton>
    )
  }

  return null
}

export { SkeletonTypography, SkeletonTypographyProps }
