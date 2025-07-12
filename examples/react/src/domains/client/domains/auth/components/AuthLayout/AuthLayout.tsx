import { useUnit } from "effector-react";
import { Fragment, type ReactElement, type ReactNode } from "react";

import { $isClientLoading } from "domains/client";

import { Inner } from "components/atoms/Inner";
import { Layout } from "components/atoms/Layout";
import { Preloader } from "components/atoms/Preloader";
import { Spacing } from "components/atoms/Spacing";
import { Footer } from "components/molecules/Footer";

import { DefaultAuthHeader } from "../DefaultAuthHeader/index.js";

type AuthLayoutProps = {
  header?: ReactNode;
  content: ReactNode;
  footer?: ReactNode;
};

function AuthLayout({
  header = <DefaultAuthHeader />,
  content,
  footer = <Footer />,
}: AuthLayoutProps): ReactElement {
  const loading = useUnit($isClientLoading);

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
  );
}

export { AuthLayout };
