import type { ReactElement } from "react";

import type { Activator } from "services/router";

import { Button, type ButtonProps } from "components/atoms/Button";
import { Link } from "components/atoms/Link";
import { Spacing, type SpacingSize } from "components/atoms/Spacing";
import { Typography, type TypographySize } from "components/atoms/Typography";

type RegularButtonSize = "small" | "default";

type RegularButtonProps = {
  size?: RegularButtonSize;
  to?: Activator;
} & Omit<ButtonProps, "size">;

function RegularButton({
  size = "default",
  to,
  ...rest
}: RegularButtonProps): ReactElement {
  type RegularButtonMetrics = {
    vertical: SpacingSize;
    horizontal: SpacingSize;
    typography: TypographySize;
  };

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
  }[size];

  const button = (
    <Typography size={metrics.typography} lineHeight="small" align="center" mix>
      <Spacing vertical={metrics.vertical} horizontal={metrics.horizontal} mix>
        <Button {...rest} />
      </Spacing>
    </Typography>
  );

  if (to != null) {
    return (
      <Link to={to} tabIndex={-1}>
        {button}
      </Link>
    );
  }

  return button;
}

export { RegularButton, type RegularButtonSize };
