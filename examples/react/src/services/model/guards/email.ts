type Email = `${string}@${string}`

function isEmail(string: string): string is Email {
  return /^.*@.*$/.test(string)
}

function email(unknown: unknown): Email | null {
  if (typeof unknown === 'string' && isEmail(unknown)) {
    return unknown
  }

  return null
}

export { email, isEmail, Email }
