`store/model` is a place to store the data model of a domain entity.

The model is a class that encapsulates data of some domain entity and methods to selects, process, or modifies entity data in some way.

There is a super-set of typed data processing functions, model field guards, exported from `services/model` service, any of generic type of fields should be stored as stored and used as a model field guard.

Models should be immutable, each method that implies a mutation of the model should return the new instance of the model.

If a domain has two or more models, `store/model` should be the folder containing each model as a separate file and an `index.ts` that exports all of them.

If the model implies to be an array of other models, it can and should use a `ListOf` helper from the `services/model` service.

For example:

```typescript
// model/Example.ts

import { capitalizedString, email, Email } from 'services/model'

type ExampleModelProps = {
  id?: number | undefined | null
  foo?: string | undefined | null
  bar?: string | undefined | null
  email?: Email | undefined | null
}

class ExampleModel {
  readonly id: number
  readonly foo: string | null
  readonly bar: string | null
  readonly email: Email | null 
  readonly fooBar: string | null

  constructor(props: ExampleModelProps) {
    this.id = props.id ?? null
    this.foo = capitalizedString(props.foo)
    this.bar = capitalizedString(props.bar)
    this.email = email(props.email)
    this.fooBar = 
      this.foo && this.bar
        ? `${this.foo}${this.bar}`
        : null
  }
  
  setFoo(value: string) {
    return ExampleModel({ ...this, foo: value })
  }
}

export { ExampleModel, ExampleModelProps }

// model/Examples.ts

import { ListOf } from 'services/model'

import { ExampleModel } from './Example'

class ExamplesModel extends ListOf(ExampleModel, (Examples) =>
  Examples.sort((leftExample: ExampleModel, rightExample: ExampleModel) => rightExample.id - leftExample.id),
) {
  getLatest(length: number = 5): ExamplesModel {
    return new ExamplesModel(...this.slice(0, length))
  }

  getById(id: number): ExampleModel | undefined {
    return this.find((example) => example.id === id)
  }
}

export { ExamplesModel }


// model/index.ts

export * from './Example.ts'
export * from './Examples.ts'
```
