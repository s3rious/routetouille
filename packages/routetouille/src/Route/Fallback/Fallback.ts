type FallbackOptions = Record<string, unknown>;

type FallbackInterface = FallbackOptions & {
  fallback: true | undefined;
};

function Fallback<ComposedOptions extends {}, ComposedInterface extends {}>(
  createRoute?: (options: ComposedOptions) => ComposedInterface,
) {
  return (
    options: FallbackOptions & ComposedOptions,
  ): FallbackInterface & ComposedInterface => {
    const composed: ComposedInterface =
      createRoute?.(options) ?? ({} as ComposedInterface);
    const fallback = true;

    return { ...composed, fallback };
  };
}

export { Fallback, type FallbackOptions, type FallbackInterface };
