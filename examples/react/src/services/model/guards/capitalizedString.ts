function capitalizedString(unknown: unknown): string | null {
  if (typeof unknown === 'string' && unknown.length > 0) {
    const lower = unknown.toLowerCase()

    return lower.charAt(0).toUpperCase() + lower.slice(1)
  }

  return null
}

export { capitalizedString }
