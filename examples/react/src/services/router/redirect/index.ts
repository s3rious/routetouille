import { Activator, Params, RouterInterface } from 'routetouille'

function redirect(
  router: RouterInterface,
  shouldWe: () => Promise<boolean>,
  to: Activator,
  params?: Params,
): [() => Promise<boolean>, () => Promise<void>] {
  return [shouldWe, async () => await router.goTo(to, { method: 'replace', optimistic: false, params })]
}

export { redirect }
