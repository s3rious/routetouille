import { capitalizedString } from 'services/model'

type PostModelProps = {
  id?: number
  title?: string | undefined | null
  body?: string | undefined | null
  datetime?: Date | undefined | null
}

class PostModel {
  readonly id: number
  readonly title: string | null
  readonly body: string | null
  readonly hook: string | null
  readonly datetime: Date | null

  constructor(props: PostModelProps) {
    this.id = props.id ?? 0
    this.title = capitalizedString(props.title)
    this.body = capitalizedString(props.body)
    this.hook = this.body && this.body?.length > 0 ? `${this.body?.slice(0, 100).trim()}...` : null
    this.datetime = props.datetime ?? null
  }
}

export { PostModel, PostModelProps }
