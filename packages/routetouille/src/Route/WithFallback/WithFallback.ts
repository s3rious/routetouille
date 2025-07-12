type WithFallbackOptions = {
  fallback?: unknown;
};

type WithFallbackInterface = WithFallbackOptions;

function WithFallback<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return (
    options: WithFallbackOptions & ComposedOptions,
  ): WithFallbackInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const fallbackRoute = options.fallback;

    const route: WithFallbackInterface & ComposedInterface = { ...composed };

    if (fallbackRoute) {
      route.fallback = fallbackRoute;
    }

    return route;
  };
}

export { WithFallback, type WithFallbackOptions, type WithFallbackInterface };
