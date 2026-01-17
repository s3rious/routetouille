import { type ReactElement, useEffect, useMemo, useState } from "react";

import { Skeleton } from "components/atoms/Skeleton";
import { Typography, type TypographyProps } from "components/atoms/Typography";

type SkeletonTypographyExactProps = {
  length: number;
};

type SkeletonTypographyMinMaxProps = {
  minLength: number;
  maxLength: number;
};

type SkeletonTypographyProps = XOR<
  SkeletonTypographyExactProps,
  SkeletonTypographyMinMaxProps
> &
  TypographyProps;

function SkeletonTypography({
  length: lengthProp,
  minLength: minLengthProp,
  maxLength: maxLengthProp,
  ...typographyProps
}: SkeletonTypographyProps): ReactElement | null {
  const minLength: number = lengthProp ?? minLengthProp ?? 0;
  const maxLength: number = lengthProp ?? maxLengthProp ?? 0;
  const [length, setLength] = useState<number | null>(null);
  const text: string = useMemo(() => {
    if (length) {
      return Array.from({ length })
        .map((_) => "█")
        .join("");
    }

    return "";
  }, [length]);

  useEffect(() => {
    const random: number = Math.random();
    const size: number = Number.parseInt(
      (random * (maxLength - minLength) + minLength).toFixed(),
      10,
    );

    setLength(size);
  }, [minLength, maxLength]);

  if (length) {
    return (
      <Skeleton background={false} mix>
        <Typography {...typographyProps}>{text}</Typography>
      </Skeleton>
    );
  }

  return null;
}

export { SkeletonTypography, type SkeletonTypographyProps };
