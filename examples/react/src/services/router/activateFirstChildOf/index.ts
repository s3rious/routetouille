import { RouterInterface } from '../index'

function activateFirstChildOf(router: RouterInterface, name: string): void {
  if (router.active[router.active.length - 1].name === name) {
    const firstChild: string | undefined = [...router.getMap().keys()]
      .filter((key) => key.split('.').includes(name))
      .filter((key) => !new RegExp(`${name}$`).test(key))?.[0]

    if (firstChild) {
      void router.goTo(firstChild, { method: 'replace', optimistic: false })
    }
  }
}

export { activateFirstChildOf }
