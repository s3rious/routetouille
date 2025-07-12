import {
  type AnyRouteInterface,
  ModuleRoute,
  type ModuleRouteInterface,
  type RouterInterface,
  WithReactRoot,
  type WithReactRootInterface,
} from "services/router/index.js";

import { Root } from "./components/Root/index.js";

function getRoute(
  router: RouterInterface,
  children: AnyRouteInterface[] = [],
): WithReactRootInterface & ModuleRouteInterface {
  return WithReactRoot(ModuleRoute)({
    router,
    name: "root",
    id: "root",
    preloaderId: "preloader",
    component: Root,
    beforeMount: async () => {
      if (
        router.pathname === "/" &&
        router.active[router.active.length - 1].fallback
      ) {
        await router.goTo("non-auth", { method: "replace", optimistic: true });
      }
    },
    children,
  });
}

export { getRoute };
export { $hideGui } from "./store/index.js";
