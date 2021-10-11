type WithFallbackOptions = {
  fallback?: unknown
}

type WithFallbackInterface = WithFallbackOptions

function WithFallback<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return function (options: WithFallbackOptions & ComposedOptions): WithFallbackInterface & ComposedInterface {
    const composed: ComposedInterface = createRoute?.(options) ?? ({} as ComposedInterface)
    const fallbackRoute = options.fallback

    const route: WithFallbackInterface & ComposedInterface = { ...composed }

    if (Boolean(fallbackRoute)) {
      route.fallback = fallbackRoute
    }

    return route
  }
}

export { WithFallback, WithFallbackOptions, WithFallbackInterface }
