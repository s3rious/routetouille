import { useUnit } from "effector-react";
import { type ReactElement, useCallback } from "react";
import { renderLastExclusiveAndTree, useRouterRoot } from "react-routetouille";

import type { AnyRouteInterface, RouterInterface } from "services/router";

import { $hideGui } from "domains/root";

type UseRootInterface = {
  render: () => ReactElement | null;
};

function useRoot(routerProp: RouterInterface): UseRootInterface {
  const { router, active } = useRouterRoot<AnyRouteInterface, RouterInterface>(
    routerProp,
  );
  const hideGUI = useUnit($hideGui);

  const render = useCallback(() => {
    if (hideGUI) {
      return null;
    }

    return renderLastExclusiveAndTree(router, active);
  }, [router, active, hideGUI]);

  return { render };
}

export { useRoot };
