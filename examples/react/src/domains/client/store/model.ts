import { email, capitalizedString, Email } from 'services/model'

type ClientModelProps = {
  email?: Email | string | null
  firstName?: string | null
  lastName?: string | null
}

class ClientModel {
  readonly email: Email | null
  readonly firstName: string | null
  readonly lastName: string | null
  readonly fullName: string | null

  constructor(props: ClientModelProps) {
    this.email = email(props.email)
    this.firstName = capitalizedString(props.firstName)
    this.lastName = capitalizedString(props.lastName)
    const names = [this.firstName, this.lastName].filter(Boolean)
    this.fullName = names.length > 0 ? names.join(' ') : null
  }

  isFetched(): boolean {
    return Boolean(this.email)
  }
}

export { ClientModel, ClientModelProps }
