import type { ReactElement } from "react";

import type { RouterInterface } from "services/router";

import { useRoot } from "domains/root/hooks/useRoot";

import "./Root.css";
import "components/atoms/Palette/Palette.css";

type RootProps = {
  router: RouterInterface;
};

function Root(props: RootProps): ReactElement | null {
  const { render } = useRoot(props.router);

  return render();
}

export { Root };
