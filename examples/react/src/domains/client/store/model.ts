import { email, capitalizedString, Email } from 'services/model'

type ClientModelProps = {
  email?: string
  firstName?: string
  lastName?: string
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
}

export { ClientModel }
