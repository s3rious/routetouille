import * as React from "react";
import type { ReactElement } from "react";
import type { RouterInterface } from "routetouille";

import { isWithReactComponent } from "../Route/index.js";
import { Context } from "../Context/index.js";

type AbstractRouter<Route> = RouterInterface & {
  active: Route[];
};

function renderLastActive<
  Route extends {},
  Router extends AbstractRouter<Route>,
>(router: Router, active: Route[]): ReactElement | null {
  const route = active[active.length - 1];

  if (isWithReactComponent(route)) {
    const Component = route.component;

    return React.createElement(
      Context.Provider,
      { value: { router } },
      React.createElement(Component, { router, route }),
    );
  }

  return null;
}

export { renderLastActive };
