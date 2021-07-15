type Params = { [key: string]: string }

function extractParams(path: string, part: string): Params | false {
  const paramNames: string[] = [...(path.match(/:\w+/g) ?? [])].map((param) => param.replace(/:/, ''))
  const pathRegexpPattern = paramNames.reduce(
    (pattern, paramName) => pattern.replace(new RegExp(`:${paramName}`), '(\\w+)?'),
    '^' + path.replace(/^\?/g, '\\?') + '$',
  )
  const pathRegexp = new RegExp(pathRegexpPattern)
  const allMatches: string[] = part.match(pathRegexp) ?? []
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, ...paramMatches] = allMatches

  if (paramMatches.length < 1) {
    return false
  }

  const matches = paramMatches.filter((match) => Boolean(match))

  if (matches.length < 1) {
    return false
  }

  return matches.reduce(
    (object, paramMatch, index) => ({
      ...object,
      [paramNames[index]]: paramMatch,
    }),
    {},
  )
}

export { extractParams, Params }
