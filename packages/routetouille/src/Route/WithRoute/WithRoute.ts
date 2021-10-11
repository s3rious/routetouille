type WithRouteOptions = {
  route?: unknown
}

type WithRouteInterface = WithRouteOptions

function WithRoute<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithRouteOptions & ComposedOptions): WithRouteInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const routeRoute = options.route

    const route: WithRouteInterface & ComposedInterface = { ...composed }

    if (Boolean(routeRoute)) {
      route.route = routeRoute
    }

    return route
  }
}

export { WithRoute, WithRouteOptions, WithRouteInterface }
