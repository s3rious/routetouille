function getListOf<AbstractModelInterface extends {}, AbstractModelProps extends unknown>(
  AbstractModel: new (AbstractModelProps: AbstractModelProps) => AbstractModelInterface,
  unknowns: AbstractModelProps[],
): AbstractModelInterface[] {
  return unknowns
    .map((unknown: AbstractModelProps) => {
      if (Object.prototype.toString.call(unknown) === '[object Object]') {
        return new AbstractModel(unknown)
      }

      return null
    })
    .filter((modelOrNull): modelOrNull is AbstractModelInterface => modelOrNull instanceof AbstractModel)
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function ListOf<AbstractModelInterface extends {}, AbstractModelProps extends unknown>(
  AbstractModel: new (AbstractModelProps: AbstractModelProps) => AbstractModelInterface,
  process?: (AbstractModels: AbstractModelInterface[]) => AbstractModelInterface[],
) {
  return class ListOfModel extends Array<AbstractModelInterface> {
    constructor(...items: AbstractModelProps[]) {
      let AbstractModels = getListOf<AbstractModelInterface, AbstractModelProps>(AbstractModel, items)

      if (process && typeof process === 'function') {
        AbstractModels = process(AbstractModels)
      }

      super(...AbstractModels)
    }
  }
}

export { ListOf, getListOf }
