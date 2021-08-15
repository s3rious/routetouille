import { get, post } from 'services/api'

type ClientResponse = {
  email: string
  firstName: string
  lastName: string
}

async function fetchClient(accessToken: string): Promise<ClientResponse> {
  const email = accessToken.split('+')[1]
  const names = email.split('@')[0]
  const firstName = names.split('.')[0] ?? null
  const lastName = names.split('.')[1] ?? null

  return get('client/', { accessToken }, { email, firstName, lastName })
}

async function getAccessTokenByEmailPasswordPair(email: string, password: string): Promise<{ accessToken: string }> {
  return post('oauth/token', { email, password }, { accessToken: `accessToken+${email}+${password}` })
}

async function revokeAccessToken(accessToken: string): Promise<null> {
  return post('oauth/revoke-token/', { accessToken }, null)
}

export { fetchClient, getAccessTokenByEmailPasswordPair, revokeAccessToken }
