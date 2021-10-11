function omitFunctions<Object extends {}>(route: Object): { [p: string]: unknown } {
  return Object.fromEntries(Object.entries(route).filter(([_key, value]) => typeof value !== 'function'))
}

export { omitFunctions }
