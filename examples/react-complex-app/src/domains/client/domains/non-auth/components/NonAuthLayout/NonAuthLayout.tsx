import type { ReactElement, ReactNode } from "react";

import { AllCenter } from "components/atoms/AllCenter";
import { Inner } from "components/atoms/Inner";
import { Layout } from "components/atoms/Layout";
import { Width } from "components/atoms/Width";
import { Footer } from "components/molecules/Footer";
import { Header } from "components/molecules/Header";

import { Background } from "../Background/index.js";

type NonAuthLayoutProps = {
  headerRight: ReactNode;
  content: ReactNode;
};

function NonAuthLayout({
  headerRight,
  content,
}: NonAuthLayoutProps): ReactElement {
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
  );
}

export { NonAuthLayout };
