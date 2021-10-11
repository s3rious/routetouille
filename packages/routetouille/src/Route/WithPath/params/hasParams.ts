function hasParams(path: string): boolean {
  return /:\w*/.test(path)
}

export { hasParams }
