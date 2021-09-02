import { GET, POST } from 'services/api'

type FetchClientResponse = {
  email: string
  firstName: string
  lastName: string
}

async function fetchClient(accessToken: string): Promise<FetchClientResponse> {
  const email = accessToken.split('+')[1]
  const names = email.split('@')[0]
  const firstName = names.split('.')[0] ?? null
  const lastName = names.split('.')[1] ?? null

  return GET('client/', { accessToken }, { email, firstName, lastName })
}

async function getAccessTokenByEmailPasswordPair(email: string, password: string): Promise<{ accessToken: string }> {
  return POST('oauth/token', { email, password }, { accessToken: `accessToken+${email}+${password}` })
}

type CreateClientResponse =
  | {
      accessToken: string
      email: string
      firstName: string
      lastName: string
    }
  | Error

async function createClient(email: string, password: string): Promise<CreateClientResponse> {
  const names = email.split('@')[0]
  const firstName = names.split('.')[0] ?? null
  const lastName = names.split('.')[1] ?? null

  if (/@example.com$/.test(email)) {
    return POST(
      'client',
      { email, password },
      {
        accessToken: `accessToken+${email}+${password}`,
        email,
        firstName,
        lastName,
      },
    )
  }

  return POST('client', { email, password }, new Error('Only clients with emails at ‘example.com’ can sign up'))
}

async function revokeAccessToken(accessToken: string): Promise<null> {
  return POST('oauth/revoke-token', { accessToken }, null)
}

export { fetchClient, getAccessTokenByEmailPasswordPair, createClient, revokeAccessToken }
