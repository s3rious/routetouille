`store/index` is a place to store a domain‘s store, or stores, itself.

[Store](https://effector.dev/docs/glossary#store) is an object that holds some state. Each store describes a logic to update itself by some trigger via the `.on` method.

In `redux`‘es terms the closest analog is a `store` and `reducer` at the same time.

Each store can and should store one primitive, object or instance of the model.

Each store should be named with [`$` prefix](https://effector.dev/docs/conventions/naming#stores-naming).

Each store should have `<DOMAIN>/<$STORE_NAME>` as their name to be easily found in logs and dev toolkit.

Each store and `effects` should be exported from the `index.ts`.

For example:

```typescript
import { Store, createStore, combine } from 'effector'

import { ExampleModel } from './model'
import * as effects from './effects'

const $example = createStore(
  new ExampleModel({}),
  { name: 'example/$example' }
)
  .on(
    effects.fetchExample.doneData,
    (state, example) => new ExampleModel({ ...state, ...example })
  )

const $isExampleLoading: Store<boolean> = combine(
  ...Object.values(effects).map((effect) => effect.pending),
  (...pendings: boolean[]) => pendings.some((pending) => pending),
)

export { $example, $isExampleLoading, effects }
```
