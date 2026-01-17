import { useUnit } from "effector-react";
import { Fragment, type ReactElement } from "react";

import { $accessToken, $client } from "domains/client";

import { Skeleton } from "components/atoms/Skeleton";
import { Stack } from "components/atoms/Stack";
import { Typography } from "components/atoms/Typography";
import { Header } from "components/molecules/Header";
import { RegularButton } from "components/molecules/RegularButton";
import { SkeletonTypography } from "components/molecules/SkeletonTypography";

function DefaultAuthHeader(): ReactElement {
  const client = useUnit($client);
  const accessToken = useUnit($accessToken);

  return (
    <Header
      right={
        <Stack horizontal={20} align="center" inline>
          <Typography size={14} color="minor">
            Hello,{" "}
            {client.fullName ? (
              client.fullName
            ) : (
              <Fragment>
                <SkeletonTypography tag="span" length={3} />
                {"\u2002"}
                <SkeletonTypography tag="span" length={4} />
              </Fragment>
            )}
          </Typography>
          <Skeleton shown={!accessToken}>
            <RegularButton to="logout" theme="outline" size="small" block>
              Log out
            </RegularButton>
          </Skeleton>
        </Stack>
      }
    />
  );
}

export { DefaultAuthHeader };
