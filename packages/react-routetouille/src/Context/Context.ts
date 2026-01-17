import { createContext, type Context as ReactContext } from "react";
import type { RouterInterface } from "routetouille";

type ContextValue = { router: RouterInterface | undefined };

const Context: ReactContext<ContextValue> = createContext<ContextValue>({
  router: undefined,
});
Context.displayName = "ReactRoutetouilleContext";

export { Context, type ContextValue };
